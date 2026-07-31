// Central knobs for admin session/2FA/rate-limit behavior. Kept in one file
// so the numbers are easy to find and adjust without hunting through the
// auth code paths that use them.

// How long a phone-verification (2FA) stays "fresh" before an admin is sent
// back through the OTP step, independent of their base Supabase session.
export const MFA_REVERIFY_AFTER_MS = 12 * 60 * 60 * 1000; // 12 hours

// App-level idle timeout, stamped by src/proxy.ts on every matched request.
// Independent of (and shorter than) Supabase's own JWT/refresh expiry.
export const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// Login rate limiting: failures counted per identifier (email or IP) within
// this rolling window before a login attempt is short-circuited.
export const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 5;

// OTP (login/enrollment SMS code) lifecycle.
export const OTP_LENGTH = 6;
export const OTP_EXPIRES_MS = 10 * 60 * 1000; // 10 minutes
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute between sends

// Probability (1-in-N) that a login attempt also opportunistically deletes
// old admin_login_attempts rows, so the table stays small without needing a
// scheduled job.
export const LOGIN_ATTEMPTS_CLEANUP_ODDS = 50;
export const LOGIN_ATTEMPTS_RETENTION_MS = 24 * 60 * 60 * 1000; // 1 day
