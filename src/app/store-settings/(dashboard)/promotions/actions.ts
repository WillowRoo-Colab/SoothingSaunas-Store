"use server";

import { revalidatePath } from "next/cache";
import { setFeaturedProduct, HOMEPAGE_FEATURED_SLOT } from "@/lib/featuredProducts";

export async function setFeaturedProductAction(formData: FormData) {
  const productHandle = String(formData.get("productHandle") ?? "").trim();

  if (!productHandle) {
    throw new Error("Select a product");
  }

  await setFeaturedProduct(HOMEPAGE_FEATURED_SLOT, productHandle);

  revalidatePath("/store-settings/promotions");
  revalidatePath("/");
}
