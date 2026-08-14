-- Adds real forensic context to each login attempt (0004 only recorded
-- identifier/kind/succeeded/created_at) — backs the deterrent warning shown
-- on the login page, which now truthfully claims what's actually captured:
-- IP, approximate location, and device/browser. All nullable — local dev
-- requests never carry Vercel's geo headers, and Tor/VPN traffic routinely
-- has no resolvable location.
alter table admin_login_attempts
  add column user_agent text,
  add column ip_country text,
  add column ip_region text,
  add column ip_city text;
