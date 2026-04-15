# Onboarding: Engineering

Engineering-specific setup and orientation for developers joining Forge.

## Setup

### Shared Tools (everyone gets these)

See [General Onboarding](onboarding-general.md#shared-tools-everyone-gets-these).

### Function-Specific Tools

| Tool | Purpose | Access |
|------|---------|--------|
| Datadog | Monitoring, alerting, APM | Request access from Sam Torres |
| PagerDuty | On-call rotation and incident management | Added by EM after first month |
| Vercel | Frontend deployments | `forge-labs` org |
| AWS Console | Infrastructure (read access initially) | Request from Sam Torres |

### Repos

| Repo | Why |
|------|-----|
| `forge-app` | Main application - frontend (React/Next.js) + backend API |
| `forge-ai` | AI generation pipeline and model serving |
| `forge-infra` | Terraform, Kubernetes configs, CI/CD pipelines |
| `forge-docs` | Public documentation site |
| `forge-product` | PRDs and specs for feature context |

### Environment Setup

1. Complete [General Onboarding](onboarding-general.md) setup first
2. Clone `forge-app`, `forge-ai`, and `forge-infra`
3. Follow `CONTRIBUTING.md` in `forge-app` for local dev setup
4. Run the test suite locally and verify it passes
5. Complete a test generation on staging and deploy it
6. Set up Datadog and bookmark the [Forge service dashboard](https://app.datadoghq.com)

## Key Documents

- [Frontend CLAUDE.md](../frontend/CLAUDE.md) - dev conventions, design system, React patterns
- [Engineering TDDs](../engineering/tdds/) - technical design documents
- [Product Context](../product/product-context/forge/CLAUDE.md) - system reference docs
- [Platform Overview](../product/product-context/forge-platform-overview.md) - what Forge does end-to-end

## Slack Channels

| Channel | Purpose |
|---------|---------|
| `#forge-eng` | Engineering discussion, architecture decisions |
| `#forge-eng-standup` | Daily async standup posts |
| `#forge-incidents` | Production incidents and on-call alerts |
| `#forge-deploys` | Automated deploy notifications |
| `#forge-general` | Team-wide announcements |

## People to Meet

| Person | Why |
|--------|-----|
| Alex Rivera | EM - team structure, sprint process, growth plan |
| Sam Torres | Engineering architecture, infrastructure |
| Priya Patel | Engineering architecture, code review norms |
| Jordan Kim | Eng peer - current sprint context |
| Sam Chen | Eng peer - frontend patterns |
| Riley Patel | Eng peer - AI pipeline |
| Morgan Wu | Eng peer - infrastructure |

## Org Chart

Engineering reports to Alex Rivera (EM). The team covers frontend, backend, AI pipeline, and infrastructure. Cross-functional partners: Product (Hannah Stulberg), Design (Taylor Brooks, Jamie Ortiz), Analytics (Casey Nguyen).

## First Tasks

- [ ] Get local dev environment running and passing tests
- [ ] Complete a test generation on staging
- [ ] Read the frontend conventions doc and one recent TDD
- [ ] Review 2-3 recent PRs to understand code review norms
- [ ] Pick up a starter bug or small feature from Linear / Jira / Asana (your manager will assign one)
- [ ] Shadow an on-call shift after your first month
