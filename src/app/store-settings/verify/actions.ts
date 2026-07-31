"use server";

import { redirect } from "next/navigation";
import { getSessionUser, getAdminProfile } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { requestOtp, verifyOtp, type OtpPurpose } from "@/lib/auth/otp";
import { verifyTotpLogin } from "@/lib/auth/totp";
import { getClientIp } from "@/lib/auth/rateLimit";

async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) redirect("/store-settings/login");
  return user;
}

function redirectWithError(message: string, params: Record<string, string> = {}): never {
  const query = new URLSearchParams({ error: message, ...params });
  redirect(`/store-settings/verify?${query.toString()}`);
}

export async function sendEnrollmentCode(formData: FormData) {
  const user = await requireSessionUser();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!phone) {
    redirectWithError("Enter a phone number.");
  }

  const result = await requestOtp(user.id, phone, "enroll");

  if (!result.ok) {
    const message =
      result.reason === "cooldown"
        ? `Please wait ${result.retryAfterSeconds}s before requesting another code.`
        : `Could not send the code: ${result.error}`;
    redirectWithError(message, { phone });
  }

  redirect(
    `/store-settings/verify?sent=1&purpose=enroll&phone=${encodeURIComponent(phone)}`
  );
}

export async function sendLoginCode() {
  const user = await requireSessionUser();
  const profile = await getAdminProfile(user.id);

  if (!profile?.phoneE164) {
    redirect("/store-settings/verify");
  }

  const result = await requestOtp(user.id, profile.phoneE164, "login");

  if (!result.ok) {
    const message =
      result.reason === "cooldown"
        ? `Please wait ${result.retryAfterSeconds}s before requesting another code.`
        : `Could not send the code: ${result.error}`;
    redirectWithError(message);
  }

  redirect("/store-settings/verify?sent=1&purpose=login");
}

export async function submitTotpCode(formData: FormData) {
  const user = await requireSessionUser();
  const code = String(formData.get("code") ?? "").trim();

  const profile = await getAdminProfile(user.id);
  if (!profile) redirect("/store-settings/login");

  const valid = await verifyTotpLogin(user.id, profile.email, code);

  if (!valid) {
    redirect(
      `/store-settings/verify?error=${encodeURIComponent(
        "That code is incorrect."
      )}&method=totp`
    );
  }

  const ip = await getClientIp();
  const admin = createAdminClient();

  const { error: mfaError } = await admin.from("admin_mfa_verifications").upsert({
    user_id: user.id,
    verified_at: new Date().toISOString(),
    verified_ip: ip,
  });
  if (mfaError) throw mfaError;

  redirect("/store-settings");
}

export async function submitCode(formData: FormData) {
  const user = await requireSessionUser();
  const code = String(formData.get("code") ?? "").trim();
  const purpose = (String(formData.get("purpose") ?? "login") as OtpPurpose) || "login";

  const result = await verifyOtp(user.id, purpose, code);

  if (!result.ok) {
    const messages: Record<typeof result.reason, string> = {
      "none-pending": "No verification code is pending — request a new one.",
      expired: "That code has expired — request a new one.",
      "too-many-attempts": "Too many incorrect attempts — request a new one.",
      invalid: "That code is incorrect.",
    };
    redirectWithError(messages[result.reason], { purpose });
  }

  const ip = await getClientIp();
  const admin = createAdminClient();

  const { error: mfaError } = await admin.from("admin_mfa_verifications").upsert({
    user_id: user.id,
    verified_at: new Date().toISOString(),
    verified_ip: ip,
  });
  if (mfaError) throw mfaError;

  if (purpose === "enroll") {
    const { error: profileError } = await admin
      .from("admin_profiles")
      .update({
        phone_e164: result.phoneE164,
        phone_verified_at: new Date().toISOString(),
        mfa_enrolled: true,
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
    if (profileError) throw profileError;

    const { error: logError } = await admin.from("admin_activity_log").insert({
      actor_user_id: user.id,
      action: "admin.mfa_enrolled",
      target: user.id,
    });
    if (logError) throw logError;
  }

  redirect("/store-settings");
}
