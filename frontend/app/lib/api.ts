import { API_BASE_URL } from "./config";
import type {
  ActivityItem,
  CompetitorRecord,
  DashboardMetrics,
  HealthSnapshot,
  LeadAuditSnapshot,
  LeadDetail,
  LeadPatchPayload,
  LeadScoreSnapshot,
  LeadSummary,
  OfferBreakdown,
  OutreachPayload,
  RecommendationPayload,
  SearchPayload,
  SearchResponse,
} from "./types";

class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function toRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function getFirst<T>(record: Record<string, unknown>, keys: string[]): T | undefined {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) {
      return record[key] as T;
    }
  }

  return undefined;
}

function asString(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    }

    if (value.toLowerCase() === "false") {
      return false;
    }
  }

  return null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => asString(item))
    .filter((item): item is string => Boolean(item));
}

function normalizeLeadSummary(value: unknown): LeadSummary {
  const record = toRecord(value);

  return {
    id: asString(getFirst(record, ["id", "lead_id"])) ?? "",
    sourceRecordId: asString(getFirst(record, ["source_record_id", "sourceRecordId"])),
    businessName:
      asString(getFirst(record, ["business_name", "businessName", "name"])) ??
      "Unnamed business",
    category: asString(getFirst(record, ["category"])),
    website: asString(getFirst(record, ["website", "domain", "url"])),
    phone: asString(getFirst(record, ["phone", "phone_number"])),
    rating: asNumber(getFirst(record, ["rating", "google_rating"])),
    reviewCount: asNumber(getFirst(record, ["review_count", "reviewCount", "user_ratings_total"])),
    address: asString(getFirst(record, ["address", "formatted_address", "street_address"])),
    city: asString(getFirst(record, ["city", "locality"])),
    country: asString(getFirst(record, ["country"])),
    source: asString(getFirst(record, ["source", "provider"])),
    sourceUrl: asString(getFirst(record, ["source_url", "sourceUrl"])),
    stage: asString(getFirst(record, ["stage", "status", "tracker_stage"])),
    priorityScore: asNumber(getFirst(record, ["priority_score", "priorityScore"])),
    estMonthlyLoss: asNumber(getFirst(record, ["est_monthly_loss", "estMonthlyLoss"])),
    primaryOffer: asString(getFirst(record, ["primary_offer", "primaryOffer"])),
    notes: asString(getFirst(record, ["notes"])),
    nextAction: asString(getFirst(record, ["next_action", "nextAction"])),
    selected: asBoolean(getFirst(record, ["selected", "is_selected"])),
  };
}

function normalizeAudit(value: unknown): LeadAuditSnapshot | null {
  const record = toRecord(value);
  if (Object.keys(record).length === 0) {
    return null;
  }

  return {
    title: asString(getFirst(record, ["title", "page_title"])),
    metaDescription: asString(getFirst(record, ["meta_description", "metaDescription"])),
    ctaPresent: asBoolean(getFirst(record, ["cta_presence", "cta_present", "ctaPresent"])),
    formsCount: asNumber(getFirst(record, ["forms_count", "formsCount"])),
    wordpressDetected: asBoolean(
      getFirst(record, ["wordpress_detected", "wordpressDetected"]),
    ),
    viewportConfigured: asBoolean(
      getFirst(record, ["viewport_mobile_hints", "viewportConfigured", "viewport_configured"]),
    ),
    majorIssues: asStringArray(getFirst(record, ["major_issues", "majorIssues"])),
    keywordCoverage: asNumber(
      getFirst(record, [
        "keyword_coverage",
        "keyword_coverage_estimate",
        "keywordCoverage",
      ]),
    ),
    missingKeywords: asStringArray(getFirst(record, ["missing_keywords", "missingKeywords"])),
    missingPages: asStringArray(getFirst(record, ["missing_pages", "missingPages"])),
    mapPackHeuristic: asString(
      getFirst(record, ["map_pack_heuristic", "gbp_gap_note", "mapPackHeuristic"]),
    ),
    reviewVelocity: asString(
      getFirst(record, ["review_velocity", "citation_review_velocity_note", "reviewVelocity"]),
    ),
    citationHeuristic: asString(
      getFirst(record, ["citation_heuristic", "citationHeuristic"]),
    ),
  };
}

function normalizeScores(value: unknown): LeadScoreSnapshot | null {
  const record = toRecord(value);
  if (Object.keys(record).length === 0) {
    return null;
  }

  return {
    websitePainScore: asNumber(getFirst(record, ["website_pain_score", "websitePainScore"])),
    automationPainScore: asNumber(
      getFirst(record, ["automation_pain_score", "automationPainScore"]),
    ),
    aiReadinessScore: asNumber(getFirst(record, ["ai_readiness_score", "aiReadinessScore"])),
    complianceRiskScore: asNumber(
      getFirst(record, ["compliance_risk_score", "complianceRiskScore"]),
    ),
    estMonthlyLoss: asNumber(getFirst(record, ["est_monthly_loss", "estMonthlyLoss"])),
    priorityScore: asNumber(getFirst(record, ["priority_score", "priorityScore"])),
    websiteFit: asBoolean(getFirst(record, ["website_fit", "websiteFit"])),
    auditFit: asBoolean(getFirst(record, ["audit_fit", "auditFit"])),
    automationFit: asBoolean(getFirst(record, ["automation_fit", "automationFit"])),
    toolFit: asBoolean(getFirst(record, ["tool_fit", "toolFit"])),
    governanceFit: asBoolean(getFirst(record, ["governance_fit", "governanceFit"])),
    primaryOffer: asString(getFirst(record, ["primary_offer", "primaryOffer"])),
    secondaryOffer: asString(getFirst(record, ["secondary_offer", "secondaryOffer"])),
    effort: asString(getFirst(record, ["effort"])),
    timeline: asString(getFirst(record, ["timeline"])),
    whyThisFirst: asString(getFirst(record, ["why_this_first", "whyThisFirst"])),
  };
}

function normalizeActivity(value: unknown): ActivityItem {
  const record = toRecord(value);

  return {
    id: asString(getFirst(record, ["id"])) ?? crypto.randomUUID(),
    type: asString(getFirst(record, ["type", "activity_type"])) ?? "activity",
    detail: asString(getFirst(record, ["detail", "message", "description"])) ?? "No detail",
    createdAt: asString(getFirst(record, ["created_at", "createdAt", "timestamp"])),
  };
}

function normalizeLeadDetail(value: unknown): LeadDetail {
  const envelope = toRecord(value);
  const nestedLead = getFirst(envelope, ["lead", "data", "result"]);
  const leadValue = nestedLead && !Array.isArray(nestedLead) ? nestedLead : value;
  const record = toRecord(leadValue);
  const base = normalizeLeadSummary(record);

  const activitiesValue =
    getFirst(record, ["activities", "activity_log"]) ??
    getFirst(envelope, ["activities", "activity_log"]);
  const activities = Array.isArray(activitiesValue)
    ? activitiesValue.map((item) => normalizeActivity(item))
    : [];
  const competitorsValue =
    getFirst(record, ["competitors"]) ?? getFirst(envelope, ["competitors", "results"]);
  const competitors = Array.isArray(competitorsValue)
    ? competitorsValue.map((item) => normalizeCompetitor(item))
    : [];
  const recommendation =
    normalizeRecommendation(getFirst(record, ["recommendation"])) ??
    normalizeRecommendation(getFirst(envelope, ["recommendation"]));

  return {
    ...base,
    ownerName: asString(getFirst(record, ["owner_name", "ownerName"])),
    proposalValue: asNumber(getFirst(record, ["proposal_value", "proposalValue"])),
    projectedRevenue: asNumber(getFirst(record, ["projected_revenue", "projectedRevenue"])),
    actualRevenue: asNumber(getFirst(record, ["actual_revenue", "actualRevenue"])),
    leadGenCost: asNumber(getFirst(record, ["lead_gen_cost", "leadGenCost"])),
    blocker: asString(getFirst(record, ["blocker"])),
    audit:
      normalizeAudit(getFirst(record, ["audit", "lead_audit", "audit_summary"])) ??
      normalizeAudit(getFirst(envelope, ["audit", "lead_audit", "audit_summary"])),
    scores:
      normalizeScores(getFirst(record, ["scores", "lead_scores", "score_summary"])) ??
      normalizeScores(getFirst(envelope, ["scores", "lead_scores", "score_summary"])),
    competitors,
    recommendation,
    activities,
  };
}

function normalizeCompetitor(value: unknown): CompetitorRecord {
  const record = toRecord(value);

  return {
    id: asString(getFirst(record, ["id"])) ?? crypto.randomUUID(),
    name: asString(getFirst(record, ["name", "business_name"])) ?? "Unknown competitor",
    rating: asNumber(getFirst(record, ["rating"])),
    reviewCount: asNumber(getFirst(record, ["review_count", "reviewCount"])),
    rankingEstimate: asString(getFirst(record, ["ranking_estimate", "rankingEstimate"])),
    source: asString(getFirst(record, ["source"])),
    strengths: asStringArray(getFirst(record, ["strengths"])),
    weaknesses: asStringArray(getFirst(record, ["weaknesses"])),
  };
}

function normalizeOfferBreakdown(value: unknown): OfferBreakdown {
  const record = toRecord(value);

  return {
    offerName:
      asString(getFirst(record, ["offer_name", "offerName", "name"])) ?? "Offer breakdown",
    whatItIs: asString(getFirst(record, ["what_it_is", "whatItIs"])),
    execution: asString(getFirst(record, ["execution", "how_we_would_execute"])),
    expectedEffort: asString(getFirst(record, ["expected_effort", "expectedEffort"])),
    timeline: asString(getFirst(record, ["timeline"])),
    valueRange: asString(getFirst(record, ["value_range", "valueRange"])),
    whyItFits: asString(getFirst(record, ["why_it_fits", "whyItFits"])),
  };
}

function normalizeRecommendation(value: unknown): RecommendationPayload | null {
  if (!value) {
    return null;
  }

  const envelope = toRecord(value);
  const record = toRecord(getFirst(envelope, ["recommendation", "data", "result"]) ?? value);
  const breakdownsValue = getFirst(record, ["breakdowns", "offers", "offer_breakdowns"]);
  const primary = getFirst(record, ["primary"]);
  const secondary = getFirst(record, ["secondary"]);
  const breakdowns = Array.isArray(breakdownsValue)
    ? breakdownsValue.map((item) => normalizeOfferBreakdown(item))
    : [primary, secondary]
        .filter((item) => Boolean(item))
        .map((item) => normalizeOfferBreakdown(item));
  const primaryBreakdown = breakdowns[0];
  const secondaryBreakdown = breakdowns[1];

  return {
    leadId: asString(getFirst(record, ["lead_id", "leadId"])),
    primaryOffer:
      asString(getFirst(record, ["primary_offer", "primaryOffer"])) ??
      primaryBreakdown?.offerName ??
      null,
    secondaryOffer:
      asString(getFirst(record, ["secondary_offer", "secondaryOffer"])) ??
      secondaryBreakdown?.offerName ??
      null,
    effort:
      asString(getFirst(record, ["effort"])) ?? primaryBreakdown?.expectedEffort ?? null,
    timeline: asString(getFirst(record, ["timeline"])) ?? primaryBreakdown?.timeline ?? null,
    whyThisFirst:
      asString(getFirst(record, ["why_this_first", "whyThisFirst"])) ??
      primaryBreakdown?.whyItFits ??
      null,
    breakdowns,
  };
}

function normalizeOutreach(value: unknown): OutreachPayload {
  const envelope = toRecord(value);
  const record = toRecord(getFirst(envelope, ["outreach", "data", "result"]) ?? value);

  return {
    emailDraft: asString(getFirst(record, ["email_draft", "emailDraft"])),
    whatsappDraft: asString(
      getFirst(record, ["whatsapp_draft", "whatsapp_placeholder", "whatsappDraft"]),
    ),
    callOpener: asString(getFirst(record, ["call_opener", "callOpener"])),
  };
}

function normalizeHealth(value: unknown): HealthSnapshot {
  if (typeof value === "string") {
    return {
      ok: true,
      status: "online",
      message: value,
      checkedAt: new Date().toISOString(),
      details: null,
    };
  }

  const record = toRecord(value);
  const ok = asBoolean(getFirst(record, ["ok", "healthy"])) ?? true;

  return {
    ok,
    status: asString(getFirst(record, ["status"])) ?? (ok ? "online" : "offline"),
    message:
      asString(getFirst(record, ["message", "detail"])) ??
      (ok ? "Backend reachable" : "Backend reported an issue"),
    checkedAt: new Date().toISOString(),
    details: record,
  };
}

function normalizeMetricsCollection(
  value: unknown,
): Array<{ label: string; value: number }> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value as Record<string, unknown>).map(([label, count]) => ({
      label,
      value: asNumber(count) ?? 0,
    }));
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const record = toRecord(item);
      return {
        label:
          asString(getFirst(record, ["label", "name", "key", "source", "town", "offer"])) ??
          "Unknown",
        value: asNumber(getFirst(record, ["value", "count", "total"])) ?? 0,
      };
    })
    .filter((item) => item.value > 0 || item.label !== "Unknown");
}

function normalizeMetrics(value: unknown): DashboardMetrics {
  const envelope = toRecord(value);
  const record = toRecord(getFirst(envelope, ["metrics", "data", "result"]) ?? value);

  return {
    currentBacklogCount:
      asNumber(getFirst(record, ["current_backlog_count", "currentBacklogCount"])) ?? 0,
    futureWatchlistCount:
      asNumber(getFirst(record, ["future_watchlist_count", "futureWatchlistCount"])) ?? 0,
    pastCount: asNumber(getFirst(record, ["past_count", "pastCount"])) ?? 0,
    openProposalValue:
      asNumber(getFirst(record, ["open_proposal_value", "openProposalValue"])) ?? 0,
    wonRevenue: asNumber(getFirst(record, ["won_revenue", "wonRevenue"])) ?? 0,
    leadGenCost: asNumber(getFirst(record, ["lead_gen_cost", "leadGenCost"])) ?? 0,
    expectedProfit: asNumber(getFirst(record, ["expected_profit", "expectedProfit"])) ?? 0,
    leadsBySource: normalizeMetricsCollection(
      getFirst(record, ["leads_by_source", "leadsBySource"]),
    ),
    leadsByTown: normalizeMetricsCollection(
      getFirst(record, ["leads_by_town", "leadsByTown"]),
    ),
    leadsByOfferType: normalizeMetricsCollection(
      getFirst(record, ["leads_by_offer_type", "leadsByOfferType"]),
    ),
  };
}

function normalizeListOfLeads(value: unknown): LeadSummary[] {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeLeadSummary(item));
  }

  const record = toRecord(value);
  const candidates =
    getFirst(record, ["results", "leads", "businesses", "data", "items"]) ?? [];

  if (Array.isArray(candidates)) {
    return candidates.map((item) => normalizeLeadSummary(item));
  }

  return [];
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  const record = toRecord(payload);
  return (
    asString(getFirst(record, ["message", "detail", "error"])) ??
    fallback ??
    "Request failed"
  );
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const payload =
      response.status === 204
        ? null
        : contentType.includes("application/json")
          ? await response.json()
          : await response.text();

    if (!response.ok) {
      throw new ApiError(
        extractErrorMessage(payload, response.statusText),
        response.status,
        payload,
      );
    }

    return payload;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function compactObject(record: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => {
      if (value === null || value === undefined) {
        return false;
      }

      if (typeof value === "string") {
        return value.trim().length > 0;
      }

      return true;
    }),
  );
}

export async function getHealth(): Promise<HealthSnapshot> {
  try {
    const payload = await request("/health");
    return normalizeHealth(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Backend unavailable";
    return {
      ok: false,
      status: "offline",
      message,
      checkedAt: new Date().toISOString(),
      details: null,
    };
  }
}

export async function searchBusinesses(payload: SearchPayload): Promise<SearchResponse> {
  const raw = await request("/search/businesses", {
    method: "POST",
    body: JSON.stringify(
      compactObject({
        query: payload.query,
        city: payload.city,
        country: payload.country,
        sources: payload.sources,
        max_results: payload.maxResults,
      }),
    ),
  });

  const results = normalizeListOfLeads(raw);
  const record = toRecord(raw);
  const count = asNumber(getFirst(record, ["count", "total"])) ?? results.length;

  return {
    results,
    count,
    raw,
  };
}

export async function getLeads(): Promise<LeadSummary[]> {
  const raw = await request("/leads");
  return normalizeListOfLeads(raw);
}

export async function getLead(id: string): Promise<LeadDetail> {
  const raw = await request(`/leads/${id}`);
  return normalizeLeadDetail(raw);
}

export async function enrichLead(id: string): Promise<void> {
  await request(`/leads/${id}/enrich`, {
    method: "POST",
  });
}

export async function getCompetitors(id: string): Promise<CompetitorRecord[]> {
  const raw = await request(`/leads/${id}/competitors`);

  if (Array.isArray(raw)) {
    return raw.map((item) => normalizeCompetitor(item));
  }

  const record = toRecord(raw);
  const competitors = getFirst(record, ["competitors", "results", "data"]);

  return Array.isArray(competitors)
    ? competitors.map((item) => normalizeCompetitor(item))
    : [];
}

export async function recommendProposal(id: string): Promise<RecommendationPayload> {
  const raw = await request(`/leads/${id}/proposal/recommend`, {
    method: "POST",
  });

  const recommendation = normalizeRecommendation(raw);
  if (!recommendation) {
    throw new ApiError("Recommendation response was empty.", 500, raw);
  }

  return recommendation;
}

export async function generateOutreach(id: string): Promise<OutreachPayload> {
  const raw = await request(`/leads/${id}/outreach/generate`, {
    method: "POST",
  });

  return normalizeOutreach(raw);
}

export async function updateLead(
  id: string,
  payload: LeadPatchPayload,
): Promise<LeadDetail> {
  const raw = await request(`/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(compactObject(payload as Record<string, unknown>)),
  });

  return normalizeLeadDetail(raw);
}

export async function ingestLead(lead: LeadSummary): Promise<LeadSummary> {
  const raw = await request("/leads/ingest", {
    method: "POST",
    body: JSON.stringify({
      leads: [
        compactObject({
          source_record_id: lead.sourceRecordId,
          source: lead.source,
          business_name: lead.businessName,
          category: lead.category,
          city: lead.city,
          country: lead.country,
          address: lead.address,
          website: lead.website,
          phone: lead.phone,
          rating: lead.rating,
          review_count: lead.reviewCount,
          source_url: lead.sourceUrl,
          selected: false,
          status: lead.stage ?? "new",
          notes: lead.notes,
          raw_payload: {},
        }),
      ],
    }),
  });

  const leads = normalizeListOfLeads(raw);
  if (!leads.length) {
    throw new ApiError("Lead ingest returned no saved lead.", 500, raw);
  }
  return leads[0];
}

export async function selectLead(id: string): Promise<LeadDetail> {
  const raw = await request(`/leads/${id}/select`, {
    method: "POST",
  });

  return normalizeLeadDetail(raw);
}

export async function unselectLead(id: string): Promise<LeadDetail> {
  const raw = await request(`/leads/${id}/unselect`, {
    method: "POST",
  });

  return normalizeLeadDetail(raw);
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const raw = await request("/metrics/dashboard");
  return normalizeMetrics(raw);
}

export { ApiError };
