import "server-only";
import { TOTP, Secret } from "otpauth";
import { createAdminClient } from "@/lib/supabase/admin";

// A second, independent 2FA method alongside SMS (see admin_otp_codes /
// src/lib/textbelt.ts) — doesn't depend on Textbelt being reachable or
// having quota left. Optional per admin, layered on top of the mandatory
// phone/SMS baseline set up during first login, never a replacement for it.
const ISSUER = "Soothing Saunas Admin";

interface TotpSecretRow {
  secret: string;
  verified_at: string | null;
}

function buildTotp(email: string, secretBase32: string): TOTP {
  return new TOTP({
    issuer: ISSUER,
    label: email,
    secret: Secret.fromBase32(secretBase32),
    digits: 6,
    period: 30,
  });
}

async function getSecretRow(userId: string): Promise<TotpSecretRow | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("admin_totp_secrets")
    .select("secret, verified_at")
    .eq("user_id", userId)
    .maybeSingle<TotpSecretRow>();

  if (error) throw error;
  return data;
}

// Starts (or restarts) enrollment: generates a fresh secret and stores it
// unverified — not usable for login until confirmTotpEnrollment succeeds.
export async function startTotpEnrollment(
  userId: string,
  email: string
): Promise<{ otpauthUrl: string; secret: string }> {
  const secret = new Secret({ size: 20 });

  const admin = createAdminClient();
  const { error } = await admin.from("admin_totp_secrets").upsert({
    user_id: userId,
    secret: secret.base32,
    verified_at: null,
  });
  if (error) throw error;

  return { otpauthUrl: buildTotp(email, secret.base32).toString(), secret: secret.base32 };
}

// Re-derives the pending (unverified) enrollment for display on the setup
// page, without needing to pass the secret through a redirect/query string.
export async function getPendingTotpEnrollment(
  userId: string,
  email: string
): Promise<{ otpauthUrl: string; secret: string } | null> {
  const row = await getSecretRow(userId);
  if (!row || row.verified_at) return null;
  return { otpauthUrl: buildTotp(email, row.secret).toString(), secret: row.secret };
}

export async function confirmTotpEnrollment(
  userId: string,
  email: string,
  code: string
): Promise<boolean> {
  const row = await getSecretRow(userId);
  if (!row) return false;

  const valid = buildTotp(email, row.secret).validate({ token: code, window: 1 }) !== null;
  if (!valid) return false;

  const admin = createAdminClient();
  const { error } = await admin
    .from("admin_totp_secrets")
    .update({ verified_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) throw error;

  return true;
}

export async function isTotpEnrolled(userId: string): Promise<boolean> {
  const row = await getSecretRow(userId);
  return !!row?.verified_at;
}

export async function verifyTotpLogin(
  userId: string,
  email: string,
  code: string
): Promise<boolean> {
  const row = await getSecretRow(userId);
  if (!row || !row.verified_at) return false;

  return buildTotp(email, row.secret).validate({ token: code, window: 1 }) !== null;
}

export async function removeTotpEnrollment(userId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("admin_totp_secrets").delete().eq("user_id", userId);
  if (error) throw error;
}
