import "server-only";
import { createHash, randomInt } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { authEnv } from "./env";
import { sendSms } from "@/lib/textbelt";
import {
  OTP_LENGTH,
  OTP_EXPIRES_MS,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_MS,
} from "./policy";

export type OtpPurpose = "login" | "enroll";

interface OtpCodeRow {
  id: string;
  code_hash: string;
  phone_e164: string;
  expires_at: string;
  consumed_at: string | null;
  attempt_count: number;
  created_at: string;
}

function generateCode(): string {
  const max = 10 ** OTP_LENGTH;
  return randomInt(0, max).toString().padStart(OTP_LENGTH, "0");
}

function hashCode(code: string): string {
  return createHash("sha256").update(`${code}:${authEnv.otpPepper}`).digest("hex");
}

export type RequestOtpResult =
  | { ok: true }
  | { ok: false; reason: "cooldown"; retryAfterSeconds: number }
  | { ok: false; reason: "send-failed"; error: string };

// Generates a code, sends it via SMS, and only persists it once the send
// actually succeeds — a failed send shouldn't consume the resend cooldown or
// leave a code on record that was never delivered.
export async function requestOtp(
  userId: string,
  phone: string,
  purpose: OtpPurpose
): Promise<RequestOtpResult> {
  const supabase = createAdminClient();

  const { data: recent, error: recentError } = await supabase
    .from("admin_otp_codes")
    .select("created_at")
    .eq("user_id", userId)
    .eq("purpose", purpose)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ created_at: string }>();

  if (recentError) throw recentError;

  if (recent) {
    const elapsed = Date.now() - new Date(recent.created_at).getTime();
    if (elapsed < OTP_RESEND_COOLDOWN_MS) {
      return {
        ok: false,
        reason: "cooldown",
        retryAfterSeconds: Math.ceil((OTP_RESEND_COOLDOWN_MS - elapsed) / 1000),
      };
    }
  }

  const code = generateCode();
  const smsResult = await sendSms(
    phone,
    `Your Soothing Saunas admin verification code is ${code}. It expires in 10 minutes.`
  );

  if (!smsResult.success) {
    return { ok: false, reason: "send-failed", error: smsResult.error ?? "Unknown error" };
  }

  const { error: insertError } = await supabase.from("admin_otp_codes").insert({
    user_id: userId,
    code_hash: hashCode(code),
    phone_e164: phone,
    purpose,
    expires_at: new Date(Date.now() + OTP_EXPIRES_MS).toISOString(),
  });

  if (insertError) throw insertError;

  return { ok: true };
}

export type VerifyOtpResult =
  | { ok: true; phoneE164: string }
  | { ok: false; reason: "none-pending" | "expired" | "too-many-attempts" | "invalid" };

export async function verifyOtp(
  userId: string,
  purpose: OtpPurpose,
  code: string
): Promise<VerifyOtpResult> {
  const supabase = createAdminClient();

  const { data: row, error } = await supabase
    .from("admin_otp_codes")
    .select("id, code_hash, phone_e164, expires_at, consumed_at, attempt_count, created_at")
    .eq("user_id", userId)
    .eq("purpose", purpose)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<OtpCodeRow>();

  if (error) throw error;
  if (!row) return { ok: false, reason: "none-pending" };

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false, reason: "expired" };
  }

  if (row.attempt_count >= OTP_MAX_ATTEMPTS) {
    return { ok: false, reason: "too-many-attempts" };
  }

  if (row.code_hash !== hashCode(code)) {
    const { error: incError } = await supabase
      .from("admin_otp_codes")
      .update({ attempt_count: row.attempt_count + 1 })
      .eq("id", row.id);
    if (incError) throw incError;
    return { ok: false, reason: "invalid" };
  }

  const { error: consumeError } = await supabase
    .from("admin_otp_codes")
    .update({ consumed_at: new Date().toISOString() })
    .eq("id", row.id);
  if (consumeError) throw consumeError;

  return { ok: true, phoneE164: row.phone_e164 };
}
