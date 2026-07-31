"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/supabase/auth";

export async function setInvitePassword(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/store-settings/login");

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    redirect(
      `/store-settings/accept-invite?error=${encodeURIComponent(
        "Password must be at least 8 characters."
      )}`
    );
  }

  if (password !== confirmPassword) {
    redirect(
      `/store-settings/accept-invite?error=${encodeURIComponent(
        "Passwords don't match."
      )}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/store-settings/accept-invite?error=${encodeURIComponent(error.message)}`);
  }

  // Phone enrollment is mandatory, not skippable — /verify will detect this
  // account has no phone on file yet and show the enrollment form.
  redirect("/store-settings/verify");
}
