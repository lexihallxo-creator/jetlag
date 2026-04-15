# Community Marketplace - Dashboard Links

**Feature:** Community Marketplace (Starter Templates)
**Owner:** Hannah Stulberg, PM
**Analytics Lead:** Casey Nguyen
**Last Updated:** 2026-03-22

## Dashboards

| Dashboard | Tool | Link | Description |
|-----------|------|------|-------------|
| Community Marketplace Overview | Sigma | [Open](https://app.sigma.com/forge-labs/dashboard/community-marketplace) | Weekly metrics: publish rate, fork rate, fork-to-deploy conversion, average rating, review queue throughput |
| Marketplace Health Monitor | Datadog | [Open](https://app.datadoghq.com/forge-labs/dashboard/marketplace-health) | Real-time monitoring: page load p95, fork error rate, API latency, abuse report volume |
| Template Discovery Funnel | Amplitude | [Open](https://app.amplitude.com/forge-labs/chart/marketplace-discovery-funnel) | Funnel: marketplace page view -> template detail view -> fork -> first generation -> deploy |
| Top Templates Leaderboard | Sigma | [Open](https://app.sigma.com/forge-labs/dashboard/top-templates) | Ranked list of templates by forks, ratings, and deploy conversion, refreshed daily |
| Publisher Analytics | Sigma | [Open](https://app.sigma.com/forge-labs/dashboard/template-publishers) | Publisher activity: submissions per week, approval rate, repeat publisher rate, top contributors |
| Category Performance | Mode | [Open](https://app.mode.com/forge-labs/reports/marketplace-categories) | Per-category breakdown: template count, fork rate, deploy conversion, average rating |
| Marketplace Search & Discovery | Amplitude | [Open](https://app.amplitude.com/forge-labs/chart/marketplace-search) | Search query analysis: top search terms, search-to-fork conversion, zero-result rate |
| Review Queue Operations | Sigma | [Open](https://app.sigma.com/forge-labs/dashboard/marketplace-review-queue) | Review queue: pending count, median review time, approval/rejection breakdown, reviewer throughput |

## Alerts

| Alert | Tool | Threshold | Channel |
|-------|------|-----------|---------|
| Marketplace page load degradation | Datadog | p95 > 3s for 5 min | #forge-eng |
| Fork error rate spike | Datadog | > 5% error rate for 10 min | #forge-eng |
| Review queue backup | Sigma (scheduled) | > 20 pending templates older than 24h | #forge-eng |
| Abuse report surge | Datadog | > 10 reports in 1 hour | #forge-eng |
