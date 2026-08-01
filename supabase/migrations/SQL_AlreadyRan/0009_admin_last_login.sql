-- Drives MFA-freshness the correct way: "was this device verified for
-- *this* login" rather than a rolling time window. Set on every fresh
-- session start (password sign-in, invite acceptance, password reset) and
-- compared against admin_mfa_verifications.verified_at.
alter table admin_profiles
  add column if not exists last_login_at timestamptz;
