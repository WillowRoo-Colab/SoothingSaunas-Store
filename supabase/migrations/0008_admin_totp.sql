-- Authenticator-app (TOTP) codes as a second, independent 2FA method
-- alongside SMS — so login still works if Textbelt is ever down or out of
-- quota. Optional per admin, enabled in addition to (never instead of) the
-- mandatory phone/SMS baseline set up during first login.
create table if not exists admin_totp_secrets (
  user_id uuid primary key references auth.users (id) on delete cascade,
  secret text not null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

alter table admin_totp_secrets enable row level security;
