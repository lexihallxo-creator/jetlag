# Environment Variables

This project uses env-based configuration only. Keep secrets out of source control and out of example screenshots.

## Backend

Recommended local file: `backend/.env`

Required:

| Variable | Required | Purpose |
| --- | --- | --- |
| `GOOGLE_PLACES_API_KEY` | Yes | Google Places Text Search and place details |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase API key for app reads/writes |
| `FRONTEND_ORIGIN` | Yes | CORS allowlist origin for the frontend |

Optional:

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | No | Richer outreach copy generation and summarization |
| `LOG_LEVEL` | No | App logging verbosity |
| `REQUEST_TIMEOUT_SECONDS` | No | Provider timeout override |

Example:

```env
GOOGLE_PLACES_API_KEY=your_google_places_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
FRONTEND_ORIGIN=http://localhost:3000
OPENAI_API_KEY=your_openai_key_optional
LOG_LEVEL=INFO
REQUEST_TIMEOUT_SECONDS=20
```

Compatibility note:

- The backend currently accepts `GOOGLE_API_KEY` as an alias for `GOOGLE_PLACES_API_KEY`, but new setups should use `GOOGLE_PLACES_API_KEY`.

## Frontend

Recommended local file: `frontend/.env.local`

Required:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | FastAPI base URL, local or deployed |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase public key |

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## n8n Automation

Recommended env vars for the Phase 1 workflow:

| Variable | Required | Purpose |
| --- | --- | --- |
| `HXP_API_BASE_URL` | Yes | Backend base URL, for example `http://localhost:8000` or Railway URL |
| `HXP_API_TOKEN` | No | Optional bearer token if backend auth is added later |

The shipped workflow uses generic HTTP Request nodes so it can run locally, on self-hosted n8n, or in n8n Cloud without provider-specific credentials.

Current backend request shapes used by the workflow:

```json
{
  "query": "dentist",
  "city": "Raleigh",
  "country": "USA",
  "sources": ["google_places"],
  "max_results": 10
}
```

```json
{
  "leads": [
    {
      "source_record_id": "provider-id",
      "source": "google_places",
      "business_name": "Example Business",
      "category": "dentist"
    }
  ]
}
```

## Secret Handling Rules

- Never commit real env files.
- Never paste live keys into docs, PRs, or screenshots.
- Rotate keys immediately if they were exposed during local debugging.
- Use platform secret stores in production:
  - Railway for backend env
  - Vercel for frontend env
  - n8n credential or env storage for workflow config

## Cross-Environment Mapping

| Local | Railway | Vercel | n8n |
| --- | --- | --- | --- |
| `backend/.env` | Backend variables | Not used | `HXP_API_BASE_URL` points here |
| `frontend/.env.local` | Not used | Frontend variables | Not used |

## Notes

- `SUPABASE_ANON_KEY` is acceptable for browser usage but should still be treated as project config, not sample filler.
- If service-role access is later required for backend-only operations, add a separate backend env var rather than reusing anon credentials.
