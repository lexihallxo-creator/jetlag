create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  source_record_id text not null,
  business_name text not null,
  category text not null,
  city text,
  country text,
  address text,
  website text,
  phone text,
  rating numeric,
  review_count integer,
  selected boolean not null default false,
  status text not null default 'new',
  notes text,
  blocker text,
  next_action text,
  proposal_value numeric not null default 0,
  projected_revenue numeric not null default 0,
  actual_revenue numeric not null default 0,
  lead_gen_cost numeric not null default 0,
  source_url text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (source, source_record_id)
);

create trigger leads_set_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

create table if not exists public.lead_scores (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  website_pain_score integer not null,
  automation_pain_score integer not null,
  ai_readiness_score integer not null,
  compliance_risk_score integer not null,
  est_monthly_loss integer not null,
  priority_score integer not null,
  website_fit boolean not null,
  audit_fit boolean not null,
  automation_fit boolean not null,
  tool_fit boolean not null,
  governance_fit boolean not null,
  primary_offer text not null,
  secondary_offer text not null,
  effort text not null,
  timeline text not null,
  why_this_first text not null,
  scoring_notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lead_audits (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  url text,
  status_code integer,
  title text,
  meta_description text,
  cta_present boolean not null default false,
  forms_count integer not null default 0,
  wordpress_detected boolean not null default false,
  viewport_present boolean not null default false,
  keyword_coverage_estimate integer not null default 0,
  missing_keywords jsonb not null default '[]'::jsonb,
  missing_pages jsonb not null default '[]'::jsonb,
  major_issues jsonb not null default '[]'::jsonb,
  gbp_gap_note text,
  citation_review_velocity_note text,
  raw_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  business_name text not null,
  city text,
  source text not null,
  rating numeric,
  review_count integer,
  website text,
  ranking_estimate integer,
  strengths jsonb not null default '[]'::jsonb,
  weaknesses jsonb not null default '[]'::jsonb,
  source_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  offer_name text not null,
  is_primary boolean not null default false,
  what_it_is text not null,
  how_we_execute text not null,
  expected_effort text not null,
  timeline text not null,
  value_range text not null,
  why_it_fits text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  activity_type text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_city_idx on public.leads(city);
create index if not exists lead_scores_lead_id_idx on public.lead_scores(lead_id, created_at desc);
create index if not exists lead_audits_lead_id_idx on public.lead_audits(lead_id, created_at desc);
create index if not exists competitors_lead_id_idx on public.competitors(lead_id);
create index if not exists recommendations_lead_id_idx on public.recommendations(lead_id, is_primary);
create index if not exists activities_lead_id_idx on public.activities(lead_id, created_at desc);
