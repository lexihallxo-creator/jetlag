from typing import Any

from pydantic import BaseModel, Field, HttpUrl

from app.schemas.common import LeadStage, SourceName


class BusinessSearchRequest(BaseModel):
    query: str = Field(min_length=2)
    city: str = Field(min_length=2)
    country: str = "USA"
    sources: list[SourceName] = Field(default_factory=lambda: [SourceName.GOOGLE_PLACES])
    max_results: int = Field(default=10, ge=1, le=20)


class BusinessSearchResult(BaseModel):
    source_record_id: str
    source: SourceName
    business_name: str
    category: str
    city: str | None = None
    country: str | None = None
    address: str | None = None
    website: str | None = None
    phone: str | None = None
    rating: float | None = None
    review_count: int | None = None
    source_url: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    categories: list[str] = Field(default_factory=list)
    raw_payload: dict[str, Any] = Field(default_factory=dict)


class LeadIngestItem(BaseModel):
    source_record_id: str
    source: SourceName
    business_name: str
    category: str
    city: str | None = None
    country: str | None = None
    address: str | None = None
    website: str | None = None
    phone: str | None = None
    rating: float | None = None
    review_count: int | None = None
    source_url: str | None = None
    selected: bool = False
    status: LeadStage = LeadStage.NEW
    notes: str | None = None
    raw_payload: dict[str, Any] = Field(default_factory=dict)


class IngestLeadsRequest(BaseModel):
    leads: list[LeadIngestItem]


class LeadUpdateRequest(BaseModel):
    selected: bool | None = None
    status: LeadStage | None = None
    notes: str | None = None
    blocker: str | None = None
    next_action: str | None = None
    proposal_value: float | None = None
    projected_revenue: float | None = None
    actual_revenue: float | None = None
    lead_gen_cost: float | None = None


class WebsiteAudit(BaseModel):
    url: str | None = None
    status_code: int | None = None
    title: str | None = None
    meta_description: str | None = None
    cta_present: bool = False
    forms_count: int = 0
    wordpress_detected: bool = False
    viewport_present: bool = False
    keyword_coverage_estimate: int = 0
    missing_keywords: list[str] = Field(default_factory=list)
    missing_pages: list[str] = Field(default_factory=list)
    major_issues: list[str] = Field(default_factory=list)
    gbp_gap_note: str | None = None
    citation_review_velocity_note: str | None = None
    raw_snapshot: dict[str, Any] = Field(default_factory=dict)


class CompetitorSnapshot(BaseModel):
    business_name: str
    city: str | None = None
    source: SourceName
    rating: float | None = None
    review_count: int | None = None
    website: str | None = None
    ranking_estimate: int | None = None
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    source_url: str | None = None


class LeadScore(BaseModel):
    website_pain_score: int
    automation_pain_score: int
    ai_readiness_score: int
    compliance_risk_score: int
    est_monthly_loss: int
    priority_score: int
    website_fit: bool
    audit_fit: bool
    automation_fit: bool
    tool_fit: bool
    governance_fit: bool
    primary_offer: str
    secondary_offer: str
    effort: str
    timeline: str
    why_this_first: str
    scoring_notes: list[str] = Field(default_factory=list)


class OfferBreakdown(BaseModel):
    offer_name: str
    what_it_is: str
    how_we_execute: str
    expected_effort: str
    timeline: str
    value_range: str
    why_it_fits: str


class ProposalRecommendationResponse(BaseModel):
    lead_id: str
    primary: OfferBreakdown
    secondary: OfferBreakdown


class OutreachDrafts(BaseModel):
    email_draft: str
    whatsapp_placeholder: str
    call_opener: str


class LeadRecord(BaseModel):
    id: str
    source_record_id: str
    source: str
    business_name: str
    category: str
    city: str | None = None
    country: str | None = None
    address: str | None = None
    website: str | None = None
    phone: str | None = None
    rating: float | None = None
    review_count: int | None = None
    selected: bool = False
    status: str = LeadStage.NEW
    notes: str | None = None
    blocker: str | None = None
    next_action: str | None = None
    proposal_value: float | None = None
    projected_revenue: float | None = None
    actual_revenue: float | None = None
    lead_gen_cost: float | None = None
    source_url: str | None = None
    created_at: str | None = None
    updated_at: str | None = None


class LeadDetailResponse(BaseModel):
    lead: LeadRecord
    scores: LeadScore | None = None
    audit: WebsiteAudit | None = None
    competitors: list[CompetitorSnapshot] = Field(default_factory=list)
    recommendation: ProposalRecommendationResponse | None = None
    activities: list[dict[str, Any]] = Field(default_factory=list)


class DashboardMetrics(BaseModel):
    current_backlog_count: int
    future_watchlist_count: int
    past_count: int
    open_proposal_value: float
    won_revenue: float
    lead_gen_cost: float
    expected_profit: float
    leads_by_source: dict[str, int]
    leads_by_town: dict[str, int]
    leads_by_offer_type: dict[str, int]


class HealthResponse(BaseModel):
    status: str
    app: str
    env: str

