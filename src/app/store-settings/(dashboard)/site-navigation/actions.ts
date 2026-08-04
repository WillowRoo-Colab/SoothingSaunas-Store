"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createNavItem,
  updateNavItem,
  deleteNavItem,
  setNavItemVisible,
  moveNavItem,
  type NavItemInput,
  type NavLocation,
  type FooterGroupLabel,
  type NavItemVariant,
} from "@/lib/navItems";

function parseInput(formData: FormData): NavItemInput {
  const location = String(formData.get("location") ?? "") as NavLocation;

  return {
    location,
    groupLabel:
      location === "footer"
        ? (String(formData.get("groupLabel") ?? "") as FooterGroupLabel)
        : null,
    title: String(formData.get("title") ?? "").trim(),
    href: String(formData.get("href") ?? "").trim(),
    variant:
      location === "hero"
        ? (String(formData.get("variant") ?? "") as NavItemVariant)
        : null,
    dimmed: formData.get("dimmed") === "on",
    visible: formData.get("visible") === "on",
  };
}

// Header/footer render on every storefront route via the shared
// (storefront)/layout.tsx, and product/collection pages cache for up to an
// hour (next: { revalidate: 3600 }) — a plain revalidatePath("/") would
// leave those routes showing stale nav for up to that long. The "layout"
// revalidation invalidates every route sharing that layout. Hero only
// renders on the homepage itself, so page-level revalidation is enough.
function revalidateForLocation(location: NavLocation) {
  revalidatePath(`/store-settings/site-navigation/${location}`);
  if (location === "hero") {
    revalidatePath("/");
  } else {
    revalidatePath("/", "layout");
  }
}

export async function createNavItemAction(formData: FormData) {
  const input = parseInput(formData);

  if (!input.title || !input.href) {
    throw new Error("Title and destination URL are required");
  }

  await createNavItem(input);

  revalidateForLocation(input.location);
  redirect(`/store-settings/site-navigation/${input.location}`);
}

export async function updateNavItemAction(id: string, formData: FormData) {
  const input = parseInput(formData);

  if (!input.title || !input.href) {
    throw new Error("Title and destination URL are required");
  }

  await updateNavItem(id, input);

  revalidateForLocation(input.location);
  redirect(`/store-settings/site-navigation/${input.location}`);
}

export async function deleteNavItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const location = String(formData.get("location") ?? "") as NavLocation;
  if (!id) throw new Error("A nav item id is required");

  await deleteNavItem(id);

  revalidateForLocation(location);
}

export async function setVisibilityAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const location = String(formData.get("location") ?? "") as NavLocation;
  const visible = formData.get("visible") === "true";
  if (!id) throw new Error("A nav item id is required");

  await setNavItemVisible(id, visible);

  revalidateForLocation(location);
}

export async function moveNavItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const location = String(formData.get("location") ?? "") as NavLocation;
  const direction = String(formData.get("direction") ?? "") as "up" | "down";
  if (!id) throw new Error("A nav item id is required");

  await moveNavItem(id, direction);

  revalidateForLocation(location);
}
