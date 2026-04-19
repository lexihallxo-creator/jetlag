# Outreach Rules

Outreach should be ultra-short, factual, and tied to a real opportunity visible in the lead data.

## Allowed Outputs

- Short email draft
- WhatsApp placeholder string only in the current implementation
- Call opener

## Hard Rules

- Under 80 words for short outbound
- Mention at least one real fact
- Mention a quantified leak or opportunity
- Recommend the best first move
- No fluff
- No fake claims
- No agency jargon

## Required Inputs

Each draft should be grounded in actual lead data such as:

- business name
- city
- category
- rating or review count
- website facts from the audit
- top recommendation from scoring
- estimated monthly loss or bounded opportunity range

If those inputs are not present, do not invent them. Fall back to a shorter deterministic draft that only uses verified facts.

## Draft Structure

Suggested shape:

1. Open with a real observed fact.
2. State the likely leak or missed opportunity.
3. Name the best first move.
4. End with a low-friction CTA.

## Current Implementation

The live backend is deterministic today. It does not yet call OpenAI even if `OPENAI_API_KEY` is present.

Fact priority is:

1. review count
2. no website found
3. no CTA found
4. no viewport tag
5. generic demand-signal fallback

## Deterministic Template

Current email shape:

```text
Saw {business_name} in {city}: {fact}, and that likely leaks about ${est_monthly_loss}/mo. Best first move: {offer}. Want the 3-step breakdown?
```

Current call opener shape:

```text
I checked {business_name} and noticed {fact}; the fastest win looks like {offer_lowercase}.
```

## LLM-Assisted Drafting

Deferred follow-up:

- If OpenAI-assisted drafting is added later, keep it strictly grounded in structured lead facts.
- Reject output that adds claims not found in the input.
- Enforce the word cap after generation.

## WhatsApp Placeholder

Phase 1 does not require delivery integration. The current backend returns a simple placeholder string rather than a JSON payload:

```text
WhatsApp draft placeholder: {business_name} | fact={fact} | monthly_leak=${est_monthly_loss} | best_first_move={offer}
```

## Call Opener Guidance

Call openers should sound natural and brief:

- mention one verified fact
- identify one likely gap
- suggest one first move

## Do Not Do This

- mention competitors unless they were actually enriched
- claim ranking drops without a source
- claim exact lost revenue without a heuristic basis
- use hype language like "10x", "revolutionize", or "guaranteed"

## QA Checklist

- factual reference is present
- recommendation matches the score output
- opportunity amount is bounded and explainable
- total length fits the channel
