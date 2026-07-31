create table if not exists admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  phone_e164 text,
  phone_verified_at timestamptz,
  mfa_enrolled boolean not null default false,
  status text not null default 'invited' check (status in ('invited', 'active', 'suspended')),
  invited_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_profiles_status_idx on admin_profiles (status);

-- RLS enabled with no policies: only ever read/written by server code using
-- the Supabase secret key (createAdminClient), which bypasses RLS by design.
-- Matches the existing site_images convention.
alter table admin_profiles enable row level security;

-- Backfill: this site's single pre-existing admin account (created directly
-- in the Supabase dashboard before this migration existed) becomes the first
-- owner. Safe to re-run — on conflict does nothing.
insert into admin_profiles (user_id, email, role, status, mfa_enrolled)
select id, email, 'owner', 'active', false
from auth.users
on conflict (user_id) do nothing;
