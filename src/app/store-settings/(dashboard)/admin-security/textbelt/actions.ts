"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/supabase/auth";
import { updateTextbeltKey } from "@/lib/textbelt";
import { createAdminClient } from "@/lib/supabase/admin";

export async function saveTextbeltKey(formData: FormData) {
  const { user } = await requireRole("owner");
  const key = String(formData.get("apiKey") ?? "").trim();
  const totalRaw = String(formData.get("purchasedQuotaTotal") ?? "").trim();

  if (!key) {
    throw new Error("An API key is required");
  }

  const purchasedQuotaTotal = totalRaw ? Number(totalRaw) : null;

  await updateTextbeltKey(
    key,
    purchasedQuotaTotal !== null && Number.isFinite(purchasedQuotaTotal)
      ? purchasedQuotaTotal
      : null,
    user.id
  );

  const admin = createAdminClient();
  const { error } = await admin.from("admin_activity_log").insert({
    actor_user_id: user.id,
    action: "textbelt.key_updated",
    target: "textbelt",
  });
  if (error) throw error;

  revalidatePath("/store-settings/admin-security/textbelt");
}
