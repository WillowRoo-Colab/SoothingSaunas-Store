create table if not exists admin_login_attempts (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  kind text not null check (kind in ('email', 'ip')),
  succeeded boolean not null,
  created_at timestamptz not null default now()
);

create index if not exists admin_login_attempts_identifier_created_idx
  on admin_login_attempts (identifier, created_at);

alter table admin_login_attempts enable row level security;
