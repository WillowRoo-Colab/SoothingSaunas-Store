"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/supabase/auth";
import { siteUrl } from "@/lib/site";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();

  if (email) {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/store-settings/reset-password`,
    });
  }

  // Always the same message regardless of whether the email matched an
  // account — never reveal which emails are registered admins.
  redirect(
    `/store-settings/reset-password?sent=1`
  );
}

export async function setNewPassword(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/store-settings/login");

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    redirect(
      `/store-settings/reset-password?error=${encodeURIComponent(
        "Password must be at least 8 characters."
      )}`
    );
  }

  if (password !== confirmPassword) {
    redirect(
      `/store-settings/reset-password?error=${encodeURIComponent(
        "Passwords don't match."
      )}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/store-settings/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/store-settings");
}
