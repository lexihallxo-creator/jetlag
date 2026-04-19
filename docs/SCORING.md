# Scoring Model

The scoring system exists to help hxp.digital prioritize leads that can close quickly and create meaningful revenue.

## Principles

- Use observable facts only.
- Missing data reduces confidence; it does not justify invented values.
- Scores should explain the recommended first offer, not obscure it.
- Keep Phase 1 deterministic and auditable.

## Score Outputs

Each lead should receive:

- `website_pain_score`
- `automation_pain_score`
- `ai_readiness_score`
- `compliance_risk_score`
- `est_monthly_loss`
- `priority_score`
- `website_fit`
- `audit_fit`
- `automation_fit`
- `tool_fit`
- `governance_fit`
- `primary_offer`
- `secondary_offer`
- `effort`
- `timeline`
- `why_this_first`

## Suggested Phase 1 Inputs

Discovery inputs:

- Google rating
- Review count
- Category
- Website URL presence
- Address and city

Website audit inputs:

- HTML title present
- Meta description present
- CTA presence
- Form count
- Mobile viewport presence
- WordPress detection
- Load failure or timeout
- Broken SSL or obvious site issues

Competitive context:

- Competitor review counts
- Competitor ratings
- Relative review gap
- Relative website quality observations when available

## Current Phase 1 Formula

The live backend keeps each component on a `0-100` scale, then derives `priority_score` from this weighted blend:

| Output | Weight |
| --- | --- |
| `website_pain_score` | 0.30 |
| `automation_pain_score` | 0.30 |
| `ai_readiness_score` | 0.15 |
| `compliance_risk_score` | 0.10 |
| Review-count modifier | up to 15 points |
| Rating bonus | 10 points when rating is at least 4.6 |

The current implementation adds review-count lift with `min(review_count, 300) * 0.05`.

## Current Website Pain Heuristics

Starting point:

- `75` if no website exists, otherwise `0`

Then add:

- `15` if title is missing
- `10` if meta description is missing
- `15` if no CTA is found
- `12` if forms count is `0`
- `10` if viewport metadata is missing
- `8` if at least two expected pages are missing

## Current Automation Pain Heuristics

Starting point:

- `20`

Then add:

- `25` if review count is at least `75`
- `10` if review count is at least `20`
- `20` if forms count is `0`
- `15` if no CTA is found
- `10` if rating is at least `4.4` and review count is at least `25`

## Current AI Readiness Heuristics

Starting point:

- `20`

Then add:

- `20` if a website exists
- `15` if review count is at least `20`
- `5` if review count is above `0`
- `10` if a CTA is present
- `10` if viewport metadata is present
- `10` if forms count is above `0`
- `10` if WordPress is detected

## Current Compliance Heuristic

`compliance_risk_score` starts at `20` and adds `45` if the category matches regulated keyword sets for:

- health
- finance
- legal

## Practical Rules

Raise `website_pain_score` when:

- no website is present
- website fails to load
- no CTA is found
- no form or booking intent exists
- no mobile viewport is declared
- metadata is weak or missing

Raise `automation_pain_score` when:

- business category likely depends on lead routing or appointment follow-up
- contact paths are fragmented
- there is demand signal but weak conversion infrastructure

Raise `ai_readiness_score` when:

- business has a working site and clear operating flow
- there is enough digital maturity to support automation or an internal tool
- the lead has multiple service lines, locations, or intake steps

Raise `compliance_risk_score` cautiously when:

- the category is likely regulated
- public site signals suggest gaps around policies, disclosures, or intake handling

## Estimated Monthly Loss

The live backend uses a demand band multiplied by combined friction:

- `2500` baseline
- `5000` when review count is at least `50`
- `8000` when review count is at least `150`
- `12000` when review count is at least `500`

Then:

```text
est_monthly_loss = demand_band * ((website_pain * 0.55 + automation_pain * 0.45) / 100)
```

The result is floored at `1500`.

## Current Offer Mapping

The live backend uses this precedence:

| Primary condition | Primary offer |
| --- | --- |
| `website_fit` and website pain is at least automation pain | Website + Conversion Refresh |
| `automation_fit` | Automation Build Sprint |
| `tool_fit` | Custom AI Tool Build |
| `governance_fit` | AI Governance Gap Assessment |
| fallback | AI Workflow Audit |

Secondary offer defaults to `AI Workflow Audit` unless that is already primary or governance risk should be surfaced.

## Confidence and Missing Data

When enrichment is incomplete:

- score only from available fields
- lower confidence in the recommendation copy
- add a note explaining what is missing

Do not:

- fabricate competitors
- infer booking flow that was not observed
- claim compliance risk without a visible reason

## Testing Expectations

At minimum, test:

- normalized score ranges stay within bounds
- missing website data increases website pain
- strong digital signals improve AI readiness
- outreach recommendation uses the primary offer chosen by scoring
- public review volume changes demand band and priority pressure
