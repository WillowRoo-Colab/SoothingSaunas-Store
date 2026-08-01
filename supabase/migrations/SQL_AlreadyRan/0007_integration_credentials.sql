-- Shared third-party API credentials (currently just Textbelt). One row
-- per integration, org-wide rather than per-admin.
create table if not exists integration_credentials (
  key text primary key,
  secret_value text not null,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

alter table integration_credentials enable row level security;
