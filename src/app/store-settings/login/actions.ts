"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { touchLastLogin } from "@/lib/supabase/auth";
import {
  isLoginRateLimited,
  recordLoginAttempt,
  getClientIp,
  getLoginAttemptContext,
} from "@/lib/auth/rateLimit";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const ip = await getClientIp();
  const context = await getLoginAttemptContext();

  if (await isLoginRateLimited(email, ip)) {
    redirect(
      `/store-settings/login?error=${encodeURIComponent(
        "Too many attempts. Please wait a few minutes and try again."
      )}`
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  await recordLoginAttempt(email, ip, !error, context);

  if (error) {
    // Deliberately the same generic message a wrong-password error would
    // give — never reveal whether the account exists. The page itself adds
    // a deterrent notice below this for any failed attempt.
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

  // proxy.ts's idle-timeout check only fires when this cookie is present
  // AND stale — but it's never cleared anywhere else, so a leftover value
  // from a previous idle-timeout/logout (still sitting in the browser)
  // would otherwise make proxy.ts sign the admin straight back out on the
  // very first request after this fresh login, over and over, looking
  // exactly like an infinite login loop even though sign-in and 2FA both
  // succeeded every time. Clearing it here guarantees a clean slate.
  const cookieStore = await cookies();
  cookieStore.set("ss_last_seen", "", { path: "/store-settings", maxAge: 0 });

  // The proxy (src/proxy.ts) will redirect on to /store-settings/verify
  // since this fresh login always needs 2FA again.
  redirect("/store-settings");
}
