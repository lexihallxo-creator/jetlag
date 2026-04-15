# Onboarding: Analytics

Analytics-specific setup and orientation for analysts joining Forge.

## Setup

### Shared Tools (everyone gets these)

See [General Onboarding](onboarding-general.md#shared-tools-everyone-gets-these).

### Function-Specific Tools

| Tool | Purpose | Access |
|------|---------|--------|
| Snowflake | Data warehouse, SQL queries | Request access from Grace Lin |
| Amplitude | Product analytics, funnels, retention | Request access from Grace Lin |
| Mode / Sigma | Data dashboards and reporting | Links in [dashboards.md](../product/analytics/dashboards.md) |
| dbt | Data transformations (read access) | Access via `forge-data` repo |

### Repos

| Repo | Why |
|------|-----|
| `forge-product` | Analytics docs, metric definitions, dashboard specs |
| `forge-data` | dbt models, pipeline configs, schema definitions |

### Environment Setup

1. Complete [General Onboarding](onboarding-general.md) setup first
2. Get Snowflake access and connect your SQL client
3. Get Amplitude access and explore existing dashboards
4. Review the [analytics schemas](../product/analytics/CLAUDE.md) for table structures
5. Bookmark key dashboards in Mode/Sigma

## Key Documents

- [Analytics CLAUDE.md](../product/analytics/CLAUDE.md) - metrics glossary, data sources, common queries, RFCs
- [Dashboards](../product/analytics/dashboards.md) - existing dashboards and links
- [Product CLAUDE.md](../product/CLAUDE.md) - product context, pillars, segments
- [Customer Insights](../product/customers/forge/CLAUDE.md) - qualitative data to pair with quantitative

## Slack Channels

| Channel | Purpose |
|---------|---------|
| `#forge-product` | Product discussions where data questions arise |
| `#forge-general` | Team-wide announcements |
| `#forge-eng` | Engineering context for instrumentation questions |

## People to Meet

| Person | Why |
|--------|-----|
| Grace Lin | Analytics lead - metrics, dashboards, data access |
| Casey Nguyen | Analytics partner for Forge - current projects and context |
| Hannah Stulberg | PM - product priorities, what metrics matter most |
| Drew Martinez | Strategy & Ops - business metrics and reporting |

## Org Chart

Analytics partners with Product and Strategy & Ops. Primary PM partner: Hannah Stulberg. Strategy & Ops partner: Drew Martinez. Data engineering partners maintain the pipelines that feed your dashboards.

## First Tasks

- [ ] Get Snowflake access and run a sample query against the generation events table
- [ ] Review the metrics glossary and key metric definitions
- [ ] Explore 2-3 existing dashboards to understand current reporting
- [ ] Meet with Casey for context transfer on current analytics projects
- [ ] Reproduce one existing analysis to validate your understanding of the data
- [ ] Pick up a small analytics task from Linear / Jira / Asana (your manager will assign one)
