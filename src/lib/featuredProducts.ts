import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminSession } from "@/lib/supabase/auth";

export const HOMEPAGE_FEATURED_SLOT = "homepage-featured";

interface FeaturedProductRow {
  product_handle: string;
}

// Public read — no admin session required. Used by guest-facing pages. A
// decorative homepage section is never worth failing the page's build/
// render over, so this fails soft (log + hide the section) rather than
// throwing — unlike setFeaturedProduct below, which should keep surfacing
// errors loudly since it's an explicit admin write.
export async function getFeaturedProductHandle(slot: string): Promise<string | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("featured_products")
      .select("product_handle")
      .eq("slot", slot)
      .maybeSingle<FeaturedProductRow>();

    if (error) throw error;
    return data?.product_handle ?? null;
  } catch (error) {
    console.error(`getFeaturedProductHandle("${slot}") failed:`, error);
    return null;
  }
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
