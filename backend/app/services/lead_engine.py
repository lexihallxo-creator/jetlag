from collections import Counter

from app.db.supabase import SupabaseRestClient
from app.schemas.common import LeadStage, SourceName
from app.schemas.lead import (
    BusinessSearchRequest,
    BusinessSearchResult,
    CompetitorSnapshot,
    DashboardMetrics,
    IngestLeadsRequest,
    LeadDetailResponse,
    LeadIngestItem,
    LeadRecord,
    LeadScore,
    LeadUpdateRequest,
    OutreachDrafts,
    ProposalRecommendationResponse,
    WebsiteAudit,
)
from app.services.adapters.website_audit import WebsiteAuditAdapter
from app.services.outreach import build_outreach_drafts
from app.services.providers.google_places import GooglePlacesProvider
from app.services.providers.local_directory_stub import LocalDirectoryStubProvider
from app.services.scoring import build_offer_breakdown, score_lead


class LeadEngineService:
    def __init__(self) -> None:
        self.providers = {
            SourceName.GOOGLE_PLACES: GooglePlacesProvider(),
            SourceName.LOCAL_DIRECTORY_STUB: LocalDirectoryStubProvider(),
        }
        self.audit_adapter = WebsiteAuditAdapter()
        self.db = SupabaseRestClient()

    async def search_businesses(self, payload: BusinessSearchRequest) -> list[BusinessSearchResult]:
        results: list[BusinessSearchResult] = []
        seen: set[tuple[str, str]] = set()

        for source in payload.sources:
            provider = self.providers.get(source)
            if not provider:
                continue
            provider_results = await provider.search(payload)
            for result in provider_results:
                dedupe_key = (result.source.value, result.source_record_id)
                if dedupe_key in seen:
                    continue
                seen.add(dedupe_key)
                results.append(result)
        return results

    async def ingest_leads(self, payload: IngestLeadsRequest) -> list[dict]:
        rows = [self._lead_ingest_to_row(item) for item in payload.leads]
        saved = await self.db.upsert_many("leads", rows, on_conflict="source,source_record_id")
        for row in saved:
            await self._log_activity(row["id"], "ingest", "Lead ingested from search.", {"source": row["source"]})
        return saved

    async def list_leads(self) -> list[dict]:
        return await self.db.select("leads", order="updated_at.desc")

    async def get_lead_detail(self, lead_id: str) -> LeadDetailResponse:
        lead = await self._get_lead_row(lead_id)
        scores = await self._latest_one("lead_scores", lead_id)
        audit = await self._latest_one("lead_audits", lead_id)
        competitors = await self.db.select("competitors", filters={"lead_id": f"eq.{lead_id}"}, order="created_at.asc")
        activities = await self.db.select("activities", filters={"lead_id": f"eq.{lead_id}"}, order="created_at.desc")
        recommendations = await self.db.select(
            "recommendations",
            filters={"lead_id": f"eq.{lead_id}"},
            order="is_primary.desc,created_at.asc",
        )
        recommendation = self._recommendations_to_response(lead_id, recommendations) if recommendations else None
        return LeadDetailResponse(
            lead=LeadRecord.model_validate(lead),
            scores=LeadScore.model_validate(scores) if scores else None,
            audit=WebsiteAudit.model_validate(audit) if audit else None,
            competitors=[CompetitorSnapshot.model_validate(row) for row in competitors],
            recommendation=recommendation,
            activities=activities,
        )

    async def enrich_lead(self, lead_id: str) -> dict:
        lead = await self._get_lead_row(lead_id)
        audit = await self.audit_adapter.audit(lead.get("website"), query=lead["category"], city=lead.get("city"))
        competitors = await self._find_competitors(lead)
        score = score_lead(lead, audit)
        recommendation = self._build_recommendation(lead_id, score)

        await self.db.insert_one("lead_audits", {"lead_id": lead_id, **audit.model_dump()})
        await self.db.insert_one("lead_scores", {"lead_id": lead_id, **score.model_dump()})

        existing = await self.db.select("competitors", filters={"lead_id": f"eq.{lead_id}"})
        for row in existing:
            pass
        if existing:
            await self.db.request("DELETE", "competitors", params={"lead_id": f"eq.{lead_id}"})
        if competitors:
            await self.db.insert_many("competitors", [{"lead_id": lead_id, **row.model_dump()} for row in competitors])

        existing_recs = await self.db.select("recommendations", filters={"lead_id": f"eq.{lead_id}"})
        if existing_recs:
            await self.db.request("DELETE", "recommendations", params={"lead_id": f"eq.{lead_id}"})
        await self.db.insert_many(
            "recommendations",
            [
                {"lead_id": lead_id, "is_primary": True, **recommendation.primary.model_dump()},
                {"lead_id": lead_id, "is_primary": False, **recommendation.secondary.model_dump()},
            ],
        )
        await self._log_activity(
            lead_id,
            "enrich",
            "Lead enriched with website audit, competitors, scoring, and recommendation.",
            {"priority_score": score.priority_score, "primary_offer": score.primary_offer},
        )
        return {
            "audit": audit.model_dump(),
            "scores": score.model_dump(),
            "competitors": [item.model_dump() for item in competitors],
            "recommendation": recommendation.model_dump(),
        }

    async def get_competitors(self, lead_id: str) -> list[dict]:
        return await self.db.select("competitors", filters={"lead_id": f"eq.{lead_id}"}, order="created_at.asc")

    async def recommend_proposal(self, lead_id: str) -> ProposalRecommendationResponse:
        detail = await self.get_lead_detail(lead_id)
        if detail.scores is None:
            await self.enrich_lead(lead_id)
            detail = await self.get_lead_detail(lead_id)
        if detail.scores is None:
            raise RuntimeError("Lead recommendation could not be generated.")
        recommendation = self._build_recommendation(lead_id, detail.scores)
        return recommendation

    async def generate_outreach(self, lead_id: str) -> OutreachDrafts:
        detail = await self.get_lead_detail(lead_id)
        if detail.scores is None or detail.audit is None:
            await self.enrich_lead(lead_id)
            detail = await self.get_lead_detail(lead_id)
        drafts = build_outreach_drafts(detail.lead.model_dump(), detail.scores, detail.audit)
        await self._log_activity(
            lead_id,
            "outreach",
            "Generated factual outreach drafts.",
            drafts.model_dump(),
        )
        return drafts

    async def update_lead(self, lead_id: str, payload: LeadUpdateRequest) -> dict:
        body = {key: value for key, value in payload.model_dump().items() if value is not None}
        if not body:
            return await self._get_lead_row(lead_id)
        updated = await self.db.patch("leads", {"id": f"eq.{lead_id}"}, body)
        await self._log_activity(lead_id, "update", "Lead updated.", body)
        return updated[0]

    async def set_selected(self, lead_id: str, selected: bool) -> dict:
        updated = await self.db.patch("leads", {"id": f"eq.{lead_id}"}, {"selected": selected})
        await self._log_activity(lead_id, "selection", "Lead selection changed.", {"selected": selected})
        return updated[0]

    async def dashboard_metrics(self) -> DashboardMetrics:
        leads = await self.db.select("leads")
        recommendations = await self.db.select("recommendations", filters={"is_primary": "eq.true"})

        leads_by_source = Counter((lead.get("source") or "unknown") for lead in leads)
        leads_by_town = Counter((lead.get("city") or "unknown") for lead in leads)
        leads_by_offer_type = Counter((row.get("offer_name") or "unknown") for row in recommendations)

        open_proposal_value = sum((lead.get("proposal_value") or 0) for lead in leads if lead.get("status") == LeadStage.PROPOSAL)
        won_revenue = sum((lead.get("actual_revenue") or 0) for lead in leads if lead.get("status") == LeadStage.WON)
        lead_gen_cost = sum((lead.get("lead_gen_cost") or 0) for lead in leads)
        projected = sum((lead.get("projected_revenue") or 0) for lead in leads if lead.get("status") not in {LeadStage.LOST, LeadStage.ARCHIVED})
        return DashboardMetrics(
            current_backlog_count=sum(1 for lead in leads if lead.get("selected") and lead.get("status") not in {LeadStage.WON, LeadStage.LOST, LeadStage.ARCHIVED}),
            future_watchlist_count=sum(1 for lead in leads if not lead.get("selected") and lead.get("status") in {LeadStage.NEW, LeadStage.QUEUED}),
            past_count=sum(1 for lead in leads if lead.get("status") in {LeadStage.WON, LeadStage.LOST, LeadStage.ARCHIVED}),
            open_proposal_value=float(open_proposal_value),
            won_revenue=float(won_revenue),
            lead_gen_cost=float(lead_gen_cost),
            expected_profit=float(projected - lead_gen_cost),
            leads_by_source=dict(leads_by_source),
            leads_by_town=dict(leads_by_town),
            leads_by_offer_type=dict(leads_by_offer_type),
        )

    async def _get_lead_row(self, lead_id: str) -> dict:
        rows = await self.db.select("leads", filters={"id": f"eq.{lead_id}"}, limit=1)
        if not rows:
            raise RuntimeError(f"Lead {lead_id} not found.")
        return rows[0]

    async def _latest_one(self, table: str, lead_id: str) -> dict | None:
        rows = await self.db.select(table, filters={"lead_id": f"eq.{lead_id}"}, order="created_at.desc", limit=1)
        return rows[0] if rows else None

    def _lead_ingest_to_row(self, item: LeadIngestItem) -> dict:
        return {
            **item.model_dump(),
            "source": item.source.value,
            "status": item.status.value,
        }

    async def _find_competitors(self, lead: dict) -> list[CompetitorSnapshot]:
        if not lead.get("city"):
            return []
        request = BusinessSearchRequest(
            query=lead["category"],
            city=lead["city"],
            country=lead.get("country") or "USA",
            sources=[SourceName.GOOGLE_PLACES],
            max_results=5,
        )
        candidates = await self.search_businesses(request)
        competitors: list[CompetitorSnapshot] = []
        rank = 1
        for candidate in candidates:
            if candidate.source_record_id == lead["source_record_id"]:
                continue
            strengths = []
            weaknesses = []
            if (candidate.review_count or 0) > (lead.get("review_count") or 0):
                strengths.append("More public reviews than the target lead.")
            if candidate.website:
                strengths.append("Has a public website.")
            if not candidate.website:
                weaknesses.append("No public website detected.")
            if (candidate.rating or 0) < 4.3:
                weaknesses.append("Lower public rating signal.")
            competitors.append(
                CompetitorSnapshot(
                    business_name=candidate.business_name,
                    city=candidate.city,
                    source=candidate.source,
                    rating=candidate.rating,
                    review_count=candidate.review_count,
                    website=candidate.website,
                    ranking_estimate=rank,
                    strengths=strengths or ["Visible in the same local search set."],
                    weaknesses=weaknesses,
                    source_url=candidate.source_url,
                )
            )
            rank += 1
            if len(competitors) == 3:
                break
        return competitors

    def _build_recommendation(self, lead_id: str, score: LeadScore) -> ProposalRecommendationResponse:
        primary_reason = score.why_this_first
        secondary_reason = (
            f"Secondary follow-up after the first offer because the lead also shows {score.secondary_offer.lower()} signals."
        )
        return ProposalRecommendationResponse(
            lead_id=lead_id,
            primary=build_offer_breakdown(score.primary_offer, primary_reason),
            secondary=build_offer_breakdown(score.secondary_offer, secondary_reason),
        )

    def _recommendations_to_response(self, lead_id: str, rows: list[dict]) -> ProposalRecommendationResponse:
        primary = next((row for row in rows if row.get("is_primary")), rows[0])
        secondary = next((row for row in rows if not row.get("is_primary")), rows[0])
        return ProposalRecommendationResponse(
            lead_id=lead_id,
            primary=build_offer_breakdown(primary["offer_name"], primary["why_it_fits"]),
            secondary=build_offer_breakdown(secondary["offer_name"], secondary["why_it_fits"]),
        )

    async def _log_activity(self, lead_id: str, activity_type: str, summary: str, payload: dict) -> None:
        await self.db.insert_one(
            "activities",
            {
                "lead_id": lead_id,
                "activity_type": activity_type,
                "summary": summary,
                "payload": payload,
            },
        )
