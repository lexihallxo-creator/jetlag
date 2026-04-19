export interface HealthSnapshot {
  ok: boolean;
  status: string;
  message: string;
  checkedAt: string;
  details?: Record<string, unknown> | null;
}

export interface SearchPayload {
  query: string;
  city: string;
  country?: string;
  sources?: string[];
  maxResults?: number;
}

export interface SearchResponse {
  results: LeadSummary[];
  count: number;
  raw: unknown;
}

export interface LeadSummary {
  id: string;
  sourceRecordId: string | null;
  businessName: string;
  category: string | null;
  website: string | null;
  phone: string | null;
  rating: number | null;
  reviewCount: number | null;
  address: string | null;
  city: string | null;
  country: string | null;
  source: string | null;
  sourceUrl: string | null;
  stage: string | null;
  priorityScore: number | null;
  estMonthlyLoss: number | null;
  primaryOffer: string | null;
  notes: string | null;
  nextAction: string | null;
  selected: boolean | null;
}

export interface LeadAuditSnapshot {
  title: string | null;
  metaDescription: string | null;
  ctaPresent: boolean | null;
  formsCount: number | null;
  wordpressDetected: boolean | null;
  viewportConfigured: boolean | null;
  majorIssues: string[];
  keywordCoverage: number | null;
  missingKeywords: string[];
  missingPages: string[];
  mapPackHeuristic: string | null;
  reviewVelocity: string | null;
  citationHeuristic: string | null;
}

export interface LeadScoreSnapshot {
  websitePainScore: number | null;
  automationPainScore: number | null;
  aiReadinessScore: number | null;
  complianceRiskScore: number | null;
  estMonthlyLoss: number | null;
  priorityScore: number | null;
  websiteFit: boolean | null;
  auditFit: boolean | null;
  automationFit: boolean | null;
  toolFit: boolean | null;
  governanceFit: boolean | null;
  primaryOffer: string | null;
  secondaryOffer: string | null;
  effort: string | null;
  timeline: string | null;
  whyThisFirst: string | null;
}

export interface ActivityItem {
  id: string;
  type: string;
  detail: string;
  createdAt: string | null;
}

export interface LeadDetail extends LeadSummary {
  ownerName: string | null;
  proposalValue: number | null;
  projectedRevenue: number | null;
  actualRevenue: number | null;
  leadGenCost: number | null;
  blocker: string | null;
  audit: LeadAuditSnapshot | null;
  scores: LeadScoreSnapshot | null;
  competitors: CompetitorRecord[];
  recommendation: RecommendationPayload | null;
  activities: ActivityItem[];
}

export interface CompetitorRecord {
  id: string;
  name: string;
  rating: number | null;
  reviewCount: number | null;
  rankingEstimate: string | null;
  source: string | null;
  strengths: string[];
  weaknesses: string[];
}

export interface OfferBreakdown {
  offerName: string;
  whatItIs: string | null;
  execution: string | null;
  expectedEffort: string | null;
  timeline: string | null;
  valueRange: string | null;
  whyItFits: string | null;
}

export interface RecommendationPayload {
  leadId?: string | null;
  primaryOffer: string | null;
  secondaryOffer: string | null;
  effort: string | null;
  timeline: string | null;
  whyThisFirst: string | null;
  breakdowns: OfferBreakdown[];
}

export interface OutreachPayload {
  emailDraft: string | null;
  whatsappDraft: string | null;
  callOpener: string | null;
}

export interface DashboardMetrics {
  currentBacklogCount: number;
  futureWatchlistCount: number;
  pastCount: number;
  openProposalValue: number;
  wonRevenue: number;
  leadGenCost: number;
  expectedProfit: number;
  leadsBySource: Array<{ label: string; value: number }>;
  leadsByTown: Array<{ label: string; value: number }>;
  leadsByOfferType: Array<{ label: string; value: number }>;
}

export interface LeadPatchPayload {
  selected?: boolean;
  status?: string;
  stage?: string;
  notes?: string;
  blocker?: string;
  next_action?: string;
  proposal_value?: number | null;
  projected_revenue?: number | null;
  actual_revenue?: number | null;
  lead_gen_cost?: number | null;
}
