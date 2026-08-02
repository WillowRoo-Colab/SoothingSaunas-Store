import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminSession } from "@/lib/supabase/auth";

export const HOMEPAGE_FEATURED_SLOT = "homepage-featured";

interface FeaturedProductRow {
  product_handle: string;
}

// Public read — no admin session required. Used by guest-facing pages.
export async function getFeaturedProductHandle(slot: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("featured_products")
    .select("product_handle")
    .eq("slot", slot)
    .maybeSingle<FeaturedProductRow>();

  if (error) throw error;
  return data?.product_handle ?? null;
}

export async function setFeaturedProduct(slot: string, productHandle: string): Promise<void> {
  const { user } = await requireAdminSession();

  const admin = createAdminClient();
  const { error } = await admin.from("featured_products").upsert(
    {
      slot,
      product_handle: productHandle,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    },
    { onConflict: "slot" }
  );

  if (error) throw error;
}
