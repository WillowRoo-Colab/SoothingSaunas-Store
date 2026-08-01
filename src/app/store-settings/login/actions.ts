"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { touchLastLogin } from "@/lib/supabase/auth";
import {
  isLoginRateLimited,
  recordLoginAttempt,
  getClientIp,
} from "@/lib/auth/rateLimit";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const ip = await getClientIp();

  if (await isLoginRateLimited(email, ip)) {
    redirect(
      `/store-settings/login?error=${encodeURIComponent(
        "Too many attempts. Please wait a few minutes and try again."
      )}`
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  await recordLoginAttempt(email, ip, !error);

  if (error) {
    // Deliberately the same generic message a wrong-password error would
    // give — never reveal whether the account exists.
    redirect(
      `/store-settings/login?error=${encodeURIComponent(
        "Incorrect email or password."
      )}`
    );
  }

  // Marks this as a fresh login — proxy.ts compares this against
  // admin_mfa_verifications.verified_at, so 2FA is always required again
  // after a new sign-in, not just once every so often.
  await touchLastLogin(data.user.id);

  // The proxy (src/proxy.ts) will redirect on to /store-settings/verify
  // since this fresh login always needs 2FA again.
  redirect("/store-settings");
}
