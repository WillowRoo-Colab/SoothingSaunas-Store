"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteUrl } from "@/lib/site";

async function logActivity(
  actorId: string,
  action: string,
  target: string,
  metadata: Record<string, unknown> = {}
) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("admin_activity_log")
    .insert({ actor_user_id: actorId, action, target, metadata });
  if (error) throw error;
}

export async function inviteAdmin(formData: FormData) {
  const { user } = await requireRole("owner");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "editor") === "owner" ? "owner" : "editor";

  if (!email) {
    throw new Error("An email address is required");
  }

  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/store-settings/accept-invite`,
  });

  if (error) throw error;

  const { error: profileError } = await admin.from("admin_profiles").upsert({
    user_id: data.user.id,
    email,
    role,
    status: "invited",
    invited_by: user.id,
  });
  if (profileError) throw profileError;

  await logActivity(user.id, "admin.invited", email, { role });

  revalidatePath("/store-settings/admin-security/admins");
}

export async function updateAdminRole(formData: FormData) {
  const { user } = await requireRole("owner");
  const targetUserId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "editor") === "owner" ? "owner" : "editor";

  if (!targetUserId) throw new Error("A user id is required");

  const admin = createAdminClient();
  const { error } = await admin
    .from("admin_profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("user_id", targetUserId);
  if (error) throw error;

  await logActivity(user.id, "admin.role_changed", targetUserId, { role });

  revalidatePath("/store-settings/admin-security/admins");
}

export async function setAdminStatus(formData: FormData) {
  const { user } = await requireRole("owner");
  const targetUserId = String(formData.get("userId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!targetUserId || (status !== "active" && status !== "suspended")) {
    throw new Error("A valid user id and status are required");
  }

  if (targetUserId === user.id && status === "suspended") {
    throw new Error("You can't suspend your own account");
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("admin_profiles")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("user_id", targetUserId);
  if (error) throw error;

  await logActivity(
    user.id,
    status === "suspended" ? "admin.suspended" : "admin.reactivated",
    targetUserId
  );

  revalidatePath("/store-settings/admin-security/admins");
}
