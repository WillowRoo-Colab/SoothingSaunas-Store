"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { confirmTotpEnrollment, removeTotpEnrollment } from "@/lib/auth/totp";

export async function confirmTotp(formData: FormData) {
  const { user, profile } = await requireAdminSession();
  const code = String(formData.get("code") ?? "").trim();

  const ok = await confirmTotpEnrollment(user.id, profile.email, code);

  if (!ok) {
    redirect(
      `/store-settings/admin-security/profile/totp-setup?error=${encodeURIComponent(
        "That code didn't match — check your authenticator app and try again."
      )}`
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.from("admin_activity_log").insert({
    actor_user_id: user.id,
    action: "admin.totp_enrolled",
    target: user.id,
  });
  if (error) throw error;

  revalidatePath("/store-settings/admin-security/profile");
  redirect("/store-settings/admin-security/profile");
}

export async function cancelTotpSetup() {
  const { user } = await requireAdminSession();
  await removeTotpEnrollment(user.id);
  redirect("/store-settings/admin-security/profile");
}
