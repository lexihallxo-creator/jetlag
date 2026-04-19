# hxp.digital Lead Engine Repo Guide

This repo is being turned into a real lead-generation system for hxp.digital.

## Mission

Build a cloud-ready web app that finds real businesses, enriches them with factual audit data, scores closeability and revenue potential, generates short outreach drafts, and tracks pipeline state.

## Non-Negotiables

- No seeded demo data in app flows, API responses, or screenshots presented as real output.
- No fake search results, fake scores, fake competitors, or placeholder outreach facts.
- If a provider is not fully wired yet, hide it behind an adapter with explicit TODOs and tests instead of inventing data.
- Keep all secrets in env files or deploy platform config. Never hardcode keys.
- Prefer a smaller real feature over a broader fake one.
- Do not revert or overwrite unrelated work. This is a shared repo.

## Expected Product Shape

- `frontend/`: Next.js App Router UI, responsive, fast, revenue-first.
- `backend/`: FastAPI API, provider adapters, scoring, enrichment, backlog routes.
- `supabase/`: SQL schema and database-related assets.
- `docs/`: operator docs, deployment docs, scoring rules, outreach rules.
- `n8n/`: automation exports for scheduled prospecting and enrichment.

## Current Reality

The repo now has a working starter implementation for the backend, frontend, and Supabase schema, but it is still an active buildout:

- Keep docs synchronized with the live route contracts and env examples.
- Mark deferred work explicitly.
- Avoid writing docs that imply feature completeness beyond the current code.

## Backend Expectations

Design around these Phase 1 routes:

- `GET /health`
- `POST /search/businesses`
- `GET /leads`
- `GET /leads/{id}`
- `POST /leads/ingest`
- `POST /leads/{id}/enrich`
- `GET /leads/{id}/competitors`
- `POST /leads/{id}/proposal/recommend`
- `POST /leads/{id}/outreach/generate`
- `PATCH /leads/{id}`
- `POST /leads/{id}/select`
- `POST /leads/{id}/unselect`
- `GET /metrics/dashboard`

Phase 1 real integrations:

- Google Places / Maps provider adapter
- Public website fetch and audit
- Supabase persistence

Phase 1 scaffold-only integrations:

- Chambers and local directory adapters
- Town website adapters
- NC Main Street adapters
- Messaging integrations

## Data and Scoring Rules

- Scores must be derived from observable facts only.
- Missing data lowers confidence; it does not justify made-up values.
- Recommendations should map directly to hxp.digital offers:
  - Website + Conversion Refresh
  - AI Workflow Audit
  - Automation Build Sprint
  - Custom AI Tool Build
  - AI Governance Gap Assessment

## Working In This Repo

- Check `git status --short` before editing and again before finishing.
- Assume other contributors may be changing `frontend/`, `backend/`, or `supabase/` at the same time.
- If you see conflicting changes in files you do not own for the current task, stop and ask before overwriting.
- Keep docs concise, current, and operator-friendly.
- Keep n8n exports env-driven so they work across local, Railway, and future hosted automation setups.
- Do not commit local runtime artifacts such as `backend/.venv/`, `.env`, or test cache folders.

## Current Contract Notes

These are the live shapes in the repo today and should stay synchronized with docs and automations:

- `POST /search/businesses` expects `query`, `city`, `country`, `sources`, and `max_results`.
- `POST /leads/ingest` expects `{ "leads": [...] }`.
- `POST /leads/{id}/enrich` currently takes no body.
- `GET /health` returns `status`, `app`, and `env`.
- Current outreach generation is deterministic; `OPENAI_API_KEY` is reserved for future richer drafting.

## Useful Local Commands

Backend:

```powershell
cd backend
py -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Tests:

```powershell
cd backend
.venv\Scripts\python.exe -m pytest tests
```

## Docs Standards

- State what works now, what needs credentials, and what is deferred.
- Use real env var names consistently across docs.
- Favor operational clarity over marketing copy.
- Do not document imaginary endpoints, fields, or scores as if they already exist.

## Automation Standards

- Daily workflows should be safe to rerun.
- Use HTTP-node-ready placeholders instead of credential-specific vendor nodes unless credentials are actually present.
- Seed Raleigh-area towns by default, but keep workflows compatible with global search terms.
- Rate-limit enrichment and keep batch sizes small enough for provider quotas.

## Default Local Assumptions

- Frontend runs on Vercel in production and locally via Next.js.
- Backend runs on Railway in production and locally via FastAPI/Uvicorn.
- Supabase hosts Postgres and storage.
- n8n runs separately and calls backend endpoints over HTTP.

## Definition of Done For Phase 1

- Real business discovery through Google Places
- Real lead persistence in Supabase
- Real website audit from fetched public pages
- Deterministic, factual scoring
- Short outreach drafts using only real lead facts
- Usable backlog and dashboard metrics
