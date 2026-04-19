# Deployment

Phase 1 deployment target:

- Frontend: Vercel
- Backend: Railway
- Database: Supabase
- Automation: n8n or n8n Cloud

This document assumes the app is being deployed as two services plus a managed database.

## Local Run

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

Quick verification:

- Backend health: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend tests:

```powershell
cd backend
.venv\Scripts\python.exe -m pytest tests
```

## 1. Provision Supabase

1. Create a new Supabase project.
2. Apply the lead engine SQL schema from `supabase/schema.sql`.
3. Confirm tables exist for:
   - `leads`
   - `lead_scores`
   - `lead_audits`
   - `competitors`
   - `recommendations`
   - `activities`
4. Copy the project URL and anon key for frontend and backend env configuration.

## 2. Deploy Backend to Railway

1. Create a new Railway service from the repo.
2. Set the service root to `backend/` if Railway is not auto-detecting it.
3. Add backend env vars:
   - `GOOGLE_PLACES_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `FRONTEND_ORIGIN`
   - `OPENAI_API_KEY` if enabled
4. Configure the start command to run the FastAPI app, for example:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

5. Deploy and verify:
   - `GET /health` returns success
   - `POST /search/businesses` returns normalized real-business results
   - `POST /leads/ingest` upserts Supabase lead rows

## 3. Deploy Frontend to Vercel

1. Import the repo into Vercel.
2. Set the frontend root to `frontend/` if needed.
3. Add frontend env vars:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy and verify:
   - Search can call the deployed backend
   - Backlog and workspace views render without hidden controls

## 4. Wire Frontend and Backend Origins

- Set backend `FRONTEND_ORIGIN` to the Vercel production URL.
- If preview deployments are used, either expand CORS handling or add preview origins explicitly.

## 5. Import the n8n Workflow

1. Import `n8n/hxp-lead-engine-phase1-daily.json`.
2. Set `HXP_API_BASE_URL` to the Railway backend URL.
3. If backend auth exists, set `HXP_API_TOKEN`.
4. Test the workflow manually before activating the daily trigger.
5. Confirm the workflow is posting the live backend shapes:
   - search body uses `sources` and `max_results`
   - ingest body wraps records inside `leads`
   - enrich hits `POST /leads/{id}/enrich` with no required body

## 6. Production Verification Checklist

- `GET /health` is green.
- Search returns real Google Places businesses.
- Lead ingestion writes to Supabase.
- Enrichment fetches live websites and stores audit facts.
- Scoring creates deterministic recommendations.
- Outreach drafts remain under the required word limit and use real facts only.
- Dashboard metrics load without demo fallback data.
- n8n daily scan completes without manual intervention.

## 7. Known Phase 1 Limits

Real now when implemented:

- Google Places discovery
- Public website audit
- Supabase-backed lead storage
- Deterministic scoring
- Deterministic outreach from real lead facts

Deferred after Phase 1:

- OpenAI-assisted outreach copy
- Gmail or WhatsApp integrations
- Additional directory adapters
- Direct map-pack ranking providers
- Richer governance/compliance provider signals

## Rollback Guidance

- Roll back frontend and backend independently.
- Avoid rolling back database schema without a migration plan.
- Pause the n8n workflow first if a backend deploy introduces ingestion or enrichment errors.
