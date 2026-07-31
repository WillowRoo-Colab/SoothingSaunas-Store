"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
  const { error } = await supabase.auth.signInWithPassword({ email, password });

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

  // The proxy (src/proxy.ts) will redirect on to /store-settings/verify if
  // this account hasn't completed a fresh phone verification yet.
  redirect("/store-settings");
}
