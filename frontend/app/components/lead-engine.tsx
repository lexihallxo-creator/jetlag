"use client";

import { useEffect, useState } from "react";
import {
  ApiError,
  enrichLead,
  ingestLead,
  generateOutreach,
  getCompetitors,
  getDashboardMetrics,
  getHealth,
  getLead,
  getLeads,
  recommendProposal,
  searchBusinesses,
  selectLead,
  unselectLead,
  updateLead,
} from "../lib/api";
import {
  API_BASE_URL,
  DEFAULT_CATEGORIES,
  DEFAULT_TOWNS,
  OPEN_PIPELINE_STAGES,
  PAST_PIPELINE_STAGES,
  SOURCE_OPTIONS,
  STAGE_OPTIONS,
} from "../lib/config";
import { formatCompact, formatCurrency, formatDateTime, formatNumber } from "../lib/format";
import type {
  CompetitorRecord,
  DashboardMetrics,
  HealthSnapshot,
  LeadDetail,
  LeadPatchPayload,
  LeadSummary,
  OutreachPayload,
  RecommendationPayload,
} from "../lib/types";

type BacklogView = "all" | "current" | "future" | "past";

const EMPTY_METRICS: DashboardMetrics = {
  currentBacklogCount: 0,
  futureWatchlistCount: 0,
  pastCount: 0,
  openProposalValue: 0,
  wonRevenue: 0,
  leadGenCost: 0,
  expectedProfit: 0,
  leadsBySource: [],
  leadsByTown: [],
  leadsByOfferType: [],
};

const EMPTY_HEALTH: HealthSnapshot = {
  ok: false,
  status: "checking",
  message: "Checking backend",
  checkedAt: new Date().toISOString(),
  details: null,
};

function bucketForStage(stage: string | null): BacklogView {
  if (!stage) {
    return "current";
  }

  if (stage === "queued") {
    return "future";
  }

  if (PAST_PIPELINE_STAGES.has(stage)) {
    return "past";
  }

  if (OPEN_PIPELINE_STAGES.has(stage)) {
    return "current";
  }

  return "all";
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

function toInputValue(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "";
  }

  return String(value);
}

function parseOptionalNumber(value: string): number | null | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function LeadEngine() {
  const [health, setHealth] = useState<HealthSnapshot>(EMPTY_HEALTH);
  const [metrics, setMetrics] = useState<DashboardMetrics>(EMPTY_METRICS);
  const [backlog, setBacklog] = useState<LeadSummary[]>([]);
  const [backlogView, setBacklogView] = useState<BacklogView>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchCity, setSearchCity] = useState("Raleigh");
  const [searchSource, setSearchSource] = useState<string>("google_places");
  const [searchResults, setSearchResults] = useState<LeadSummary[]>([]);
  const [searchCount, setSearchCount] = useState(0);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [backlogError, setBacklogError] = useState<string | null>(null);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<LeadSummary | null>(null);
  const [leadDetail, setLeadDetail] = useState<LeadDetail | null>(null);
  const [competitors, setCompetitors] = useState<CompetitorRecord[]>([]);
  const [recommendation, setRecommendation] = useState<RecommendationPayload | null>(null);
  const [outreach, setOutreach] = useState<OutreachPayload | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [backlogLoading, setBacklogLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [savingLead, setSavingLead] = useState(false);
  const [ingestingLeadKey, setIngestingLeadKey] = useState<string | null>(null);
  const [selectionLoading, setSelectionLoading] = useState(false);
  const [workspaceMessage, setWorkspaceMessage] = useState<string | null>(null);
  const [stageDraft, setStageDraft] = useState("new");
  const [notesDraft, setNotesDraft] = useState("");
  const [nextActionDraft, setNextActionDraft] = useState("");
  const [blockerDraft, setBlockerDraft] = useState("");
  const [proposalValueDraft, setProposalValueDraft] = useState("");
  const [projectedRevenueDraft, setProjectedRevenueDraft] = useState("");
  const [actualRevenueDraft, setActualRevenueDraft] = useState("");
  const [leadGenCostDraft, setLeadGenCostDraft] = useState("");

  async function loadDashboard() {
    setMetricsLoading(true);

    const [healthResult, metricsResult] = await Promise.allSettled([
      getHealth(),
      getDashboardMetrics(),
    ]);

    if (healthResult.status === "fulfilled") {
      setHealth(healthResult.value);
    } else {
      setHealth((current) => ({
        ...current,
        ok: false,
        status: "offline",
        message: getErrorMessage(healthResult.reason),
        checkedAt: new Date().toISOString(),
      }));
    }

    if (metricsResult.status === "fulfilled") {
      setMetrics(metricsResult.value);
    }

    setMetricsLoading(false);
  }

  async function loadBacklog(activeId?: string) {
    setBacklogLoading(true);
    setBacklogError(null);

    try {
      const leads = await getLeads();
      setBacklog(leads);

      if (activeId) {
        const updatedLead = leads.find((lead) => lead.id === activeId);
        if (updatedLead) {
          setActiveLead(updatedLead);
        }
      }
    } catch (error) {
      setBacklogError(getErrorMessage(error));
    } finally {
      setBacklogLoading(false);
    }
  }

  useEffect(() => {
    void (async () => {
      await Promise.all([loadDashboard(), loadBacklog()]);
    })();
  }, []);

  function syncEditor(detail: LeadDetail | LeadSummary) {
    setStageDraft(detail.stage ?? "new");
    setNotesDraft(detail.notes ?? "");
    setNextActionDraft(detail.nextAction ?? "");
    setBlockerDraft("blocker" in detail ? detail.blocker ?? "" : "");
    setProposalValueDraft(
      "proposalValue" in detail ? toInputValue(detail.proposalValue) : "",
    );
    setProjectedRevenueDraft(
      "projectedRevenue" in detail ? toInputValue(detail.projectedRevenue) : "",
    );
    setActualRevenueDraft(
      "actualRevenue" in detail ? toInputValue(detail.actualRevenue) : "",
    );
    setLeadGenCostDraft("leadGenCost" in detail ? toInputValue(detail.leadGenCost) : "");
  }

  async function openLead(lead: LeadSummary) {
    setActiveLead(lead);
    setLeadDetail(null);
    setCompetitors([]);
    setRecommendation(null);
    setOutreach(null);
    setWorkspaceError(null);
    setWorkspaceMessage(null);
    syncEditor(lead);

    if (!lead.id) {
      setWorkspaceMessage(
        "This result is preview-only until the backend persists it as a lead.",
      );
      return;
    }

    setWorkspaceLoading(true);

    try {
      const detail = await getLead(lead.id);
      setLeadDetail(detail);
      setActiveLead(detail);
      setCompetitors(detail.competitors);
      setRecommendation(detail.recommendation);
      syncEditor(detail);
    } catch (error) {
      setWorkspaceError(getErrorMessage(error));
    } finally {
      setWorkspaceLoading(false);
    }
  }

  async function runSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const resolvedQuery = (searchQuery || searchCategory).trim();
    if (resolvedQuery.length < 2 || searchCity.trim().length < 2) {
      setSearchError("Search needs at least a business query and city.");
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const response = await searchBusinesses({
        query: resolvedQuery,
        city: searchCity,
        country: "USA",
        sources: [searchSource],
        maxResults: 10,
      });

      setSearchResults(response.results);
      setSearchCount(response.count);
    } catch (error) {
      setSearchResults([]);
      setSearchCount(0);
      setSearchError(getErrorMessage(error));
    } finally {
      setSearchLoading(false);
    }
  }

  async function refreshLeadDetail(message?: string) {
    if (!activeLead?.id) {
      return;
    }

    setWorkspaceLoading(true);
    setWorkspaceError(null);

    try {
      const detail = await getLead(activeLead.id);
      setLeadDetail(detail);
      setActiveLead(detail);
      setCompetitors(detail.competitors);
      setRecommendation(detail.recommendation);
      syncEditor(detail);
      if (message) {
        setWorkspaceMessage(message);
      }
    } catch (error) {
      setWorkspaceError(getErrorMessage(error));
    } finally {
      setWorkspaceLoading(false);
    }
  }

  async function handleEnrich() {
    if (!activeLead?.id) {
      return;
    }

    setWorkspaceLoading(true);
    setWorkspaceError(null);
    setWorkspaceMessage(null);

    try {
      await enrichLead(activeLead.id);
      await refreshLeadDetail("Fresh audit and scoring requested from the backend.");
      await Promise.all([loadDashboard(), loadBacklog(activeLead.id)]);
    } catch (error) {
      setWorkspaceError(getErrorMessage(error));
    } finally {
      setWorkspaceLoading(false);
    }
  }

  async function handleCompetitors() {
    if (!activeLead?.id) {
      return;
    }

    setWorkspaceLoading(true);
    setWorkspaceError(null);
    setWorkspaceMessage(null);

    try {
      const records = await getCompetitors(activeLead.id);
      setCompetitors(records);
      setWorkspaceMessage(
        records.length > 0
          ? "Competitor comparison loaded."
          : "No competitor data returned for this lead yet.",
      );
    } catch (error) {
      setWorkspaceError(getErrorMessage(error));
    } finally {
      setWorkspaceLoading(false);
    }
  }

  async function handleRecommendation() {
    if (!activeLead?.id) {
      return;
    }

    setWorkspaceLoading(true);
    setWorkspaceError(null);
    setWorkspaceMessage(null);

    try {
      const payload = await recommendProposal(activeLead.id);
      setRecommendation(payload);
      setWorkspaceMessage(
        payload.primaryOffer
          ? "Offer recommendation generated from current lead data."
          : "Recommendation endpoint returned without an offer.",
      );
      await refreshLeadDetail();
    } catch (error) {
      setWorkspaceError(getErrorMessage(error));
      setWorkspaceLoading(false);
    }
  }

  async function handleOutreach() {
    if (!activeLead?.id) {
      return;
    }

    setWorkspaceLoading(true);
    setWorkspaceError(null);
    setWorkspaceMessage(null);

    try {
      const payload = await generateOutreach(activeLead.id);
      setOutreach(payload);
      setWorkspaceMessage(
        payload.emailDraft
          ? "Outreach drafts generated from the latest lead data."
          : "No outreach copy returned yet.",
      );
    } catch (error) {
      setWorkspaceError(getErrorMessage(error));
    } finally {
      setWorkspaceLoading(false);
    }
  }

  async function handleSaveLead() {
    if (!activeLead?.id) {
      setWorkspaceMessage("A lead id is required before changes can be saved.");
      return;
    }

    const payload: LeadPatchPayload = {
      status: stageDraft,
      notes: notesDraft,
      blocker: blockerDraft,
      next_action: nextActionDraft,
      proposal_value: parseOptionalNumber(proposalValueDraft),
      projected_revenue: parseOptionalNumber(projectedRevenueDraft),
      actual_revenue: parseOptionalNumber(actualRevenueDraft),
      lead_gen_cost: parseOptionalNumber(leadGenCostDraft),
    };

    setSavingLead(true);
    setWorkspaceError(null);
    setWorkspaceMessage(null);

    try {
      await updateLead(activeLead.id, payload);
      await refreshLeadDetail("Lead updates saved.");
      await Promise.all([loadBacklog(activeLead.id), loadDashboard()]);
    } catch (error) {
      setWorkspaceError(getErrorMessage(error));
    } finally {
      setSavingLead(false);
    }
  }

  async function handleIngestLead(lead: LeadSummary) {
    if (lead.id) {
      await openLead(lead);
      return;
    }

    const ingestKey = lead.sourceRecordId || lead.businessName;
    setIngestingLeadKey(ingestKey);
    setSearchError(null);
    setWorkspaceError(null);
    setWorkspaceMessage(null);

    try {
      const savedLead = await ingestLead(lead);
      setSearchResults((current) =>
        current.map((item) =>
          (item.sourceRecordId || item.businessName) === ingestKey ? savedLead : item,
        ),
      );
      setSearchCount((current) => (current > 0 ? current : searchResults.length));
      await Promise.all([loadBacklog(savedLead.id), loadDashboard()]);
      await openLead(savedLead);
      setWorkspaceMessage("Lead saved to backlog.");
    } catch (error) {
      setSearchError(getErrorMessage(error));
    } finally {
      setIngestingLeadKey(null);
    }
  }

  async function handleSelection(selected: boolean) {
    if (!activeLead?.id) {
      return;
    }

    setSelectionLoading(true);
    setWorkspaceError(null);
    setWorkspaceMessage(null);

    try {
      if (selected) {
        await selectLead(activeLead.id);
      } else {
        await unselectLead(activeLead.id);
      }
      await refreshLeadDetail(
        selected ? "Lead moved into current backlog." : "Lead moved to future watchlist.",
      );
      await Promise.all([loadBacklog(activeLead.id), loadDashboard()]);
    } catch (error) {
      setWorkspaceError(getErrorMessage(error));
    } finally {
      setSelectionLoading(false);
    }
  }

  const displayedLead = leadDetail ?? activeLead;
  const filteredBacklog = backlog.filter((lead) => {
    if (backlogView === "all") {
      return true;
    }

    return bucketForStage(lead.stage) === backlogView;
  });

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">hxp.digital</p>
          <h1>Lead engine</h1>
          <p className="hero-copy">
            Real search, clear pipeline movement, and factual outreach tied to live backend
            actions.
          </p>
        </div>
        <div className="hero-meta">
          <span className={`health-pill ${health.ok ? "ok" : "offline"}`}>
            {health.ok ? "Backend online" : "Backend issue"}
          </span>
          <p>{health.message}</p>
          <p className="muted">API base: {API_BASE_URL}</p>
          <p className="muted">Last check: {formatDateTime(health.checkedAt)}</p>
        </div>
      </section>

      <section className="metrics-grid">
        <MetricCard
          label="Current backlog"
          value={formatNumber(metrics.currentBacklogCount)}
          loading={metricsLoading}
        />
        <MetricCard
          label="Future watchlist"
          value={formatNumber(metrics.futureWatchlistCount)}
          loading={metricsLoading}
        />
        <MetricCard label="Past" value={formatNumber(metrics.pastCount)} loading={metricsLoading} />
        <MetricCard
          label="Open proposal value"
          value={formatCurrency(metrics.openProposalValue)}
          loading={metricsLoading}
        />
        <MetricCard
          label="Won revenue"
          value={formatCurrency(metrics.wonRevenue)}
          loading={metricsLoading}
        />
        <MetricCard
          label="Expected profit"
          value={formatCurrency(metrics.expectedProfit)}
          loading={metricsLoading}
        />
      </section>

      <section className="distribution-grid">
        <DistributionCard title="Sources" items={metrics.leadsBySource} />
        <DistributionCard title="Towns" items={metrics.leadsByTown} />
        <DistributionCard title="Offer mix" items={metrics.leadsByOfferType} />
      </section>

      <section className="workspace-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Discovery</p>
              <h2>Search real businesses</h2>
            </div>
            <span className="counter-chip">{searchCount || searchResults.length} results</span>
          </div>

          <form className="search-form" onSubmit={runSearch}>
            <label>
              Business or niche
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="dentist, med spa, roofer"
              />
            </label>
            <label>
              Category
              <input
                value={searchCategory}
                onChange={(event) => setSearchCategory(event.target.value)}
                placeholder="cosmetic dentistry"
              />
            </label>
            <label>
              City
              <input
                value={searchCity}
                onChange={(event) => setSearchCity(event.target.value)}
                placeholder="Raleigh"
              />
            </label>

            <div className="chip-group">
              <span className="chip-label">Categories</span>
              {DEFAULT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`chip ${searchCategory === category ? "active" : ""}`}
                  onClick={() => {
                    setSearchCategory(category);
                    if (!searchQuery) {
                      setSearchQuery(category);
                    }
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="chip-group">
              <span className="chip-label">Towns</span>
              {DEFAULT_TOWNS.map((town) => (
                <button
                  key={town}
                  type="button"
                  className={`chip ${searchCity === town ? "active" : ""}`}
                  onClick={() => setSearchCity(town)}
                >
                  {town}
                </button>
              ))}
            </div>

            <div className="chip-group">
              <span className="chip-label">Sources</span>
              {SOURCE_OPTIONS.map((source) => (
                <button
                  key={source.id}
                  type="button"
                  className={`chip ${searchSource === source.id ? "active" : ""}`}
                  onClick={() => setSearchSource(source.id)}
                >
                  {source.label}
                  <span className="chip-tag">{source.status}</span>
                </button>
              ))}
            </div>

            <div className="button-row">
              <button type="submit" className="primary-button" disabled={searchLoading}>
                {searchLoading ? "Searching..." : "Run search"}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchCategory("");
                  setSearchCity("Raleigh");
                  setSearchSource("google_places");
                  setSearchResults([]);
                  setSearchCount(0);
                  setSearchError(null);
                }}
              >
                Clear
              </button>
            </div>
          </form>

          {searchError ? <p className="panel-error">{searchError}</p> : null}

          <div className="card-list">
            {searchResults.length === 0 ? (
              <EmptyState
                title="No live search results yet"
                description="Run a search to pull real businesses from the backend provider."
              />
            ) : (
              searchResults.map((lead) => (
                <article
                  key={`${lead.id || lead.businessName}-${lead.address || lead.website || "lead"}`}
                  className="lead-card"
                >
                  <div className="lead-card-header">
                    <div>
                      <h3>{lead.businessName}</h3>
                      <p className="muted">
                        {lead.city || "City unavailable"}
                        {lead.source ? ` | ${lead.source}` : ""}
                      </p>
                    </div>
                    {lead.priorityScore !== null ? (
                      <span className="score-pill">P{formatNumber(lead.priorityScore)}</span>
                    ) : null}
                  </div>
                  <p>{lead.address || "Address unavailable"}</p>
                  <p className="muted">{lead.category || "Category unavailable"}</p>
                  <p className="muted">
                    {lead.website ? (
                      <a href={lead.website} target="_blank" rel="noreferrer">
                        {lead.website}
                      </a>
                    ) : (
                      "Website unavailable"
                    )}
                  </p>
                  <div className="stats-row">
                    <span>Rating {formatNumber(lead.rating)}</span>
                    <span>Reviews {formatCompact(lead.reviewCount)}</span>
                    <span>Loss {formatCurrency(lead.estMonthlyLoss)}</span>
                  </div>
                  <div className="button-row">
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => void openLead(lead)}
                    >
                      {lead.id ? "Open workspace" : "Preview"}
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      disabled={ingestingLeadKey === (lead.sourceRecordId || lead.businessName)}
                      onClick={() => void handleIngestLead(lead)}
                    >
                      {lead.id
                        ? "Saved"
                        : ingestingLeadKey === (lead.sourceRecordId || lead.businessName)
                          ? "Saving..."
                          : "Save lead"}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Pipeline</p>
              <h2>Backlog</h2>
            </div>
            <div className="button-row compact">
              <button
                type="button"
                className="secondary-button"
                onClick={() => void loadBacklog(activeLead?.id)}
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="chip-group">
            <span className="chip-label">View</span>
            {[
              ["all", "All"],
              ["current", "Current"],
              ["future", "Future"],
              ["past", "Past"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`chip ${backlogView === value ? "active" : ""}`}
                onClick={() => setBacklogView(value as BacklogView)}
              >
                {label}
              </button>
            ))}
          </div>

          {backlogError ? <p className="panel-error">{backlogError}</p> : null}

          <div className="card-list">
            {backlogLoading ? (
              <EmptyState title="Loading backlog" description="Pulling persisted leads from the API." />
            ) : filteredBacklog.length === 0 ? (
              <EmptyState
                title="No leads in this backlog view"
                description="Saved leads will appear here once the backend has persisted them."
              />
            ) : (
              filteredBacklog.map((lead) => (
                <article key={lead.id || lead.businessName} className="lead-card">
                  <div className="lead-card-header">
                  <div>
                    <h3>{lead.businessName}</h3>
                    <p className="muted">
                      {lead.stage || "new"}
                      {lead.city ? ` | ${lead.city}` : ""}
                    </p>
                  </div>
                  {lead.selected ? <span className="selected-pill">Selected</span> : null}
                </div>
                  <p>{lead.primaryOffer || lead.category || "Offer not recommended yet"}</p>
                  <div className="stats-row">
                    <span>Priority {formatNumber(lead.priorityScore)}</span>
                    <span>Loss {formatCurrency(lead.estMonthlyLoss)}</span>
                  </div>
                  <p className="muted">{lead.nextAction || "No next action logged."}</p>
                  <div className="button-row">
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => void openLead(lead)}
                    >
                      Open
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="panel workspace-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Execution</p>
              <h2>Workspace</h2>
            </div>
            {displayedLead?.id ? (
              <button
                type="button"
                className="secondary-button"
                onClick={() => void refreshLeadDetail("Lead detail refreshed.")}
              >
                Refresh lead
              </button>
            ) : null}
          </div>

          {!displayedLead ? (
            <EmptyState
              title="Choose a lead"
              description="Open a search result or backlog item to inspect details, run audits, and draft outreach."
            />
          ) : (
            <>
              <section className="workspace-summary">
                <div>
                  <h3>{displayedLead.businessName}</h3>
                  <p className="muted">
                    {displayedLead.city || "City unavailable"}
                    {displayedLead.address ? ` | ${displayedLead.address}` : ""}
                  </p>
                  <p className="muted">
                    {displayedLead.category || "Category unavailable"}
                    {displayedLead.phone ? ` | ${displayedLead.phone}` : ""}
                  </p>
                  <p className="muted">
                    {displayedLead.website ? (
                      <a href={displayedLead.website} target="_blank" rel="noreferrer">
                        {displayedLead.website}
                      </a>
                    ) : (
                      "Website unavailable"
                    )}
                  </p>
                </div>
                <div className="summary-badges">
                  <span className="chip active">{displayedLead.stage || "new"}</span>
                  {displayedLead.source ? <span className="chip">{displayedLead.source}</span> : null}
                </div>
              </section>

              <div className="stats-grid">
                <StatTile label="Priority" value={formatNumber(displayedLead.priorityScore)} />
                <StatTile label="Rating" value={formatNumber(displayedLead.rating)} />
                <StatTile label="Reviews" value={formatCompact(displayedLead.reviewCount)} />
                <StatTile label="Monthly leak" value={formatCurrency(displayedLead.estMonthlyLoss)} />
              </div>

              <div className="button-row wrap">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => void handleIngestLead(displayedLead)}
                  disabled={Boolean(displayedLead.id) || ingestingLeadKey === (displayedLead.sourceRecordId || displayedLead.businessName)}
                >
                  {displayedLead.id
                    ? "Saved to backlog"
                    : ingestingLeadKey === (displayedLead.sourceRecordId || displayedLead.businessName)
                      ? "Saving..."
                      : "Save to backlog"}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => void handleSelection(!displayedLead.selected)}
                  disabled={!displayedLead.id || workspaceLoading || selectionLoading}
                >
                  {selectionLoading
                    ? "Updating..."
                    : displayedLead.selected
                      ? "Move to watchlist"
                      : "Move to current backlog"}
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => void handleEnrich()}
                  disabled={!displayedLead.id || workspaceLoading}
                >
                  Run enrichment
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => void handleCompetitors()}
                  disabled={!displayedLead.id || workspaceLoading}
                >
                  Load competitors
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => void handleRecommendation()}
                  disabled={!displayedLead.id || workspaceLoading}
                >
                  Recommend proposal
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => void handleOutreach()}
                  disabled={!displayedLead.id || workspaceLoading}
                >
                  Generate outreach
                </button>
              </div>

              {!displayedLead.id ? (
                <p className="panel-warning">
                  This result is not persisted yet, so backend actions stay disabled until the lead
                  exists in `/leads`.
                </p>
              ) : null}
              {workspaceLoading ? <p className="muted">Working with backend...</p> : null}
              {workspaceMessage ? <p className="panel-success">{workspaceMessage}</p> : null}
              {workspaceError ? <p className="panel-error">{workspaceError}</p> : null}

              <section className="detail-section">
                <div className="section-heading">
                  <h3>Pipeline controls</h3>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => void handleSaveLead()}
                    disabled={!displayedLead.id || savingLead}
                  >
                    {savingLead ? "Saving..." : "Save lead"}
                  </button>
                </div>
                <div className="form-grid">
                  <label>
                    Stage
                    <select value={stageDraft} onChange={(event) => setStageDraft(event.target.value)}>
                      {STAGE_OPTIONS.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Next action
                    <input
                      value={nextActionDraft}
                      onChange={(event) => setNextActionDraft(event.target.value)}
                      placeholder="Send audit summary"
                    />
                  </label>
                  <label>
                    Blocker
                    <input
                      value={blockerDraft}
                      onChange={(event) => setBlockerDraft(event.target.value)}
                      placeholder="Need owner email"
                    />
                  </label>
                  <label>
                    Proposal value
                    <input
                      inputMode="decimal"
                      value={proposalValueDraft}
                      onChange={(event) => setProposalValueDraft(event.target.value)}
                      placeholder="7500"
                    />
                  </label>
                  <label>
                    Projected revenue
                    <input
                      inputMode="decimal"
                      value={projectedRevenueDraft}
                      onChange={(event) => setProjectedRevenueDraft(event.target.value)}
                      placeholder="12000"
                    />
                  </label>
                  <label>
                    Actual revenue
                    <input
                      inputMode="decimal"
                      value={actualRevenueDraft}
                      onChange={(event) => setActualRevenueDraft(event.target.value)}
                      placeholder="9000"
                    />
                  </label>
                  <label>
                    Lead gen cost
                    <input
                      inputMode="decimal"
                      value={leadGenCostDraft}
                      onChange={(event) => setLeadGenCostDraft(event.target.value)}
                      placeholder="55"
                    />
                  </label>
                  <label className="full-width">
                    Notes
                    <textarea
                      rows={4}
                      value={notesDraft}
                      onChange={(event) => setNotesDraft(event.target.value)}
                      placeholder="Concise notes, objections, facts, and next move."
                    />
                  </label>
                </div>
              </section>

              <section className="detail-section">
                <div className="section-heading">
                  <h3>Audit snapshot</h3>
                </div>
                {leadDetail?.audit ? (
                  <>
                    <div className="stats-grid">
                      <StatTile
                        label="CTA present"
                        value={leadDetail.audit.ctaPresent === null ? "-" : leadDetail.audit.ctaPresent ? "Yes" : "No"}
                      />
                      <StatTile
                        label="Forms"
                        value={formatNumber(leadDetail.audit.formsCount)}
                      />
                      <StatTile
                        label="WordPress"
                        value={
                          leadDetail.audit.wordpressDetected === null
                            ? "-"
                            : leadDetail.audit.wordpressDetected
                              ? "Yes"
                              : "No"
                        }
                      />
                      <StatTile
                        label="Keyword coverage"
                        value={formatNumber(leadDetail.audit.keywordCoverage)}
                      />
                    </div>
                    <div className="detail-stack">
                      <DetailRow label="Title" value={leadDetail.audit.title} />
                      <DetailRow
                        label="Meta description"
                        value={leadDetail.audit.metaDescription}
                      />
                      <DetailRow
                        label="Missing keywords"
                        value={leadDetail.audit.missingKeywords.join(", ")}
                      />
                      <DetailRow
                        label="Missing pages"
                        value={leadDetail.audit.missingPages.join(", ")}
                      />
                      <DetailRow
                        label="Map pack heuristic"
                        value={leadDetail.audit.mapPackHeuristic}
                      />
                      <DetailRow
                        label="Review velocity"
                        value={leadDetail.audit.reviewVelocity}
                      />
                    </div>
                    {leadDetail.audit.majorIssues.length > 0 ? (
                      <div className="tag-list">
                        {leadDetail.audit.majorIssues.map((issue) => (
                          <span key={issue} className="tag">
                            {issue}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <EmptyState
                    title="No audit yet"
                    description="Run enrichment once the backend has a saved lead to fetch website and score data."
                  />
                )}
              </section>

              <section className="detail-section">
                <div className="section-heading">
                  <h3>Scoring and recommendation</h3>
                </div>
                {leadDetail?.scores || leadDetail?.recommendation || recommendation ? (
                  <>
                    {leadDetail?.scores ? (
                      <div className="stats-grid">
                        <StatTile
                          label="Website pain"
                          value={formatNumber(leadDetail.scores.websitePainScore)}
                        />
                        <StatTile
                          label="Automation pain"
                          value={formatNumber(leadDetail.scores.automationPainScore)}
                        />
                        <StatTile
                          label="AI readiness"
                          value={formatNumber(leadDetail.scores.aiReadinessScore)}
                        />
                        <StatTile
                          label="Compliance risk"
                          value={formatNumber(leadDetail.scores.complianceRiskScore)}
                        />
                      </div>
                    ) : null}
                    <div className="detail-stack">
                      <DetailRow
                        label="Primary offer"
                        value={
                          recommendation?.primaryOffer ??
                          leadDetail?.recommendation?.primaryOffer ??
                          leadDetail?.scores?.primaryOffer ??
                          displayedLead.primaryOffer
                        }
                      />
                      <DetailRow
                        label="Secondary offer"
                        value={
                          recommendation?.secondaryOffer ??
                          leadDetail?.recommendation?.secondaryOffer ??
                          leadDetail?.scores?.secondaryOffer
                        }
                      />
                      <DetailRow
                        label="Effort"
                        value={
                          recommendation?.effort ??
                          leadDetail?.recommendation?.effort ??
                          leadDetail?.scores?.effort
                        }
                      />
                      <DetailRow
                        label="Timeline"
                        value={
                          recommendation?.timeline ??
                          leadDetail?.recommendation?.timeline ??
                          leadDetail?.scores?.timeline
                        }
                      />
                      <DetailRow
                        label="Why this first"
                        value={
                          recommendation?.whyThisFirst ??
                          leadDetail?.recommendation?.whyThisFirst ??
                          leadDetail?.scores?.whyThisFirst
                        }
                      />
                    </div>
                    {(recommendation?.breakdowns?.length || leadDetail?.recommendation?.breakdowns?.length) ? (
                      <div className="detail-list">
                        {(recommendation?.breakdowns || leadDetail?.recommendation?.breakdowns || []).map((item) => (
                          <article key={item.offerName} className="mini-card">
                            <h4>{item.offerName}</h4>
                            <p>{item.whatItIs || "No offer summary returned."}</p>
                            <p className="muted">{item.execution}</p>
                            <p className="muted">
                              {item.expectedEffort || "Effort pending"}
                              {item.timeline ? ` | ${item.timeline}` : ""}
                              {item.valueRange ? ` | ${item.valueRange}` : ""}
                            </p>
                            <p className="muted">{item.whyItFits}</p>
                          </article>
                        ))}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <EmptyState
                    title="No scoring or recommendation yet"
                    description="Run enrichment and then recommend a proposal to pull revenue-focused guidance into this panel."
                  />
                )}
              </section>

              <section className="detail-section">
                <div className="section-heading">
                  <h3>Competitors</h3>
                </div>
                {competitors.length > 0 ? (
                  <div className="detail-list">
                    {competitors.map((competitor) => (
                      <article key={competitor.id} className="mini-card">
                        <h4>{competitor.name}</h4>
                        <p className="muted">
                          Rating {formatNumber(competitor.rating)} | Reviews{" "}
                          {formatCompact(competitor.reviewCount)}
                        </p>
                        <p>{competitor.rankingEstimate || "Ranking estimate unavailable"}</p>
                        {competitor.strengths.length > 0 ? (
                          <p className="muted">Strengths: {competitor.strengths.join(", ")}</p>
                        ) : null}
                        {competitor.weaknesses.length > 0 ? (
                          <p className="muted">Weaknesses: {competitor.weaknesses.join(", ")}</p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No competitor data loaded"
                    description="Use the competitor button when the selected lead has an id in the backend."
                  />
                )}
              </section>

              <section className="detail-section">
                <div className="section-heading">
                  <h3>Outreach</h3>
                </div>
                {outreach ? (
                  <div className="detail-list">
                    <article className="mini-card">
                      <h4>Email draft</h4>
                      <p>{outreach.emailDraft || "No email draft returned."}</p>
                    </article>
                    <article className="mini-card">
                      <h4>WhatsApp structure</h4>
                      <p>{outreach.whatsappDraft || "No WhatsApp structure returned."}</p>
                    </article>
                    <article className="mini-card">
                      <h4>Call opener</h4>
                      <p>{outreach.callOpener || "No call opener returned."}</p>
                    </article>
                  </div>
                ) : (
                  <EmptyState
                    title="No outreach generated"
                    description="Generate outreach after a lead has enough real audit or scoring context."
                  />
                )}
              </section>

              <section className="detail-section">
                <div className="section-heading">
                  <h3>Activity log</h3>
                </div>
                {leadDetail?.activities.length ? (
                  <div className="detail-list">
                    {leadDetail.activities.map((activity) => (
                      <article key={activity.id} className="mini-card">
                        <h4>{activity.type}</h4>
                        <p>{activity.detail}</p>
                        <p className="muted">{formatDateTime(activity.createdAt)}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No activity yet"
                    description="Backend activity records will appear here when available."
                  />
                )}
              </section>
            </>
          )}
        </section>
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: string;
  loading: boolean;
}) {
  return (
    <article className="metric-card">
      <p className="muted">{label}</p>
      <h3>{loading ? "..." : value}</h3>
    </article>
  );
}

function DistributionCard({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; value: number }>;
}) {
  return (
    <article className="distribution-card">
      <div className="section-heading">
        <h3>{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="muted">No data yet.</p>
      ) : (
        <div className="detail-stack">
          {items.map((item) => (
            <div key={item.label} className="distribution-row">
              <span>{item.label}</span>
              <strong>{formatNumber(item.value)}</strong>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <article className="stat-tile">
      <p className="muted">{label}</p>
      <h4>{value}</h4>
    </article>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="detail-row">
      <span className="muted">{label}</span>
      <strong>{value && value.trim() ? value : "Not available"}</strong>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <article className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
