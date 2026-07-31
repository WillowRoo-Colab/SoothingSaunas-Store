"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { startTotpEnrollment, removeTotpEnrollment } from "@/lib/auth/totp";

export async function beginTotpEnrollment() {
  const { profile } = await requireAdminSession();
  await startTotpEnrollment(profile.userId, profile.email);
  redirect("/store-settings/admin-security/profile/totp-setup");
}

export async function disableTotp() {
  const { user } = await requireAdminSession();
  await removeTotpEnrollment(user.id);

  const admin = createAdminClient();
  const { error } = await admin.from("admin_activity_log").insert({
    actor_user_id: user.id,
    action: "admin.totp_disabled",
    target: user.id,
  });
  if (error) throw error;

  revalidatePath("/store-settings/admin-security/profile");
}

export async function updateDisplayName(formData: FormData) {
  const { user } = await requireAdminSession();
  const displayName = String(formData.get("displayName") ?? "").trim();

  const admin = createAdminClient();
  const { error } = await admin
    .from("admin_profiles")
    .update({ display_name: displayName || null, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/store-settings/admin-security/profile");
}
