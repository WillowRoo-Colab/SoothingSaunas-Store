-- Custom SMS OTP store. Not Supabase's native auth.mfa tables — those only
-- support Twilio/MessageBird/Textlocal/Vonage as SMS providers, not Textbelt.
create table if not exists admin_otp_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  code_hash text not null,
  phone_e164 text not null,
  purpose text not null default 'login' check (purpose in ('login', 'enroll')),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  attempt_count int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists admin_otp_codes_user_purpose_idx
  on admin_otp_codes (user_id, purpose, created_at desc);

alter table admin_otp_codes enable row level security;

-- Freshness of "this admin has proven phone possession recently." Written
-- only from a trusted server action after a code check succeeds — never
-- from client-writable auth.users.user_metadata, which a client-side
-- supabase.auth.updateUser() call could otherwise forge.
create table if not exists admin_mfa_verifications (
  user_id uuid primary key references auth.users (id) on delete cascade,
  verified_at timestamptz not null,
  verified_ip text
);

alter table admin_mfa_verifications enable row level security;
