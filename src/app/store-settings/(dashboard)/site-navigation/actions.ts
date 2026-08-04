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
  const isDropdown = location === "header" && formData.get("isDropdown") === "on";

  let columnCount: number | null = null;
  let columnHeadings: string[] = [];
  if (isDropdown) {
    const rawCount = Number(formData.get("columnCount") ?? 1);
    columnCount = Math.min(4, Math.max(1, Number.isFinite(rawCount) ? rawCount : 1));
    columnHeadings = Array.from({ length: columnCount }, (_, i) =>
      String(formData.get(`columnHeading${i + 1}`) ?? "").trim()
    );
  }

  const parentIdRaw = String(formData.get("parentId") ?? "").trim();
  const parentId = parentIdRaw || null;
  const columnIndexRaw = formData.get("columnIndex");
  const columnIndex = parentId && columnIndexRaw ? Number(columnIndexRaw) : null;

  return {
    location,
    groupLabel:
      location === "footer"
        ? (String(formData.get("groupLabel") ?? "") as FooterGroupLabel)
        : null,
    title: String(formData.get("title") ?? "").trim(),
    href: isDropdown ? "#" : String(formData.get("href") ?? "").trim(),
    variant:
      location === "hero"
        ? (String(formData.get("variant") ?? "") as NavItemVariant)
        : null,
    dimmed: formData.get("dimmed") === "on",
    visible: formData.get("visible") === "on",
    parentId,
    columnIndex,
    isDropdown,
    columnCount,
    columnHeadings,
  };
}

function validate(input: NavItemInput) {
  if (!input.title || (!input.isDropdown && !input.href)) {
    throw new Error("Title and destination URL are required");
  }
  if (input.isDropdown && input.columnHeadings.some((heading) => !heading)) {
    throw new Error("Every column needs a heading");
  }
}

// Header/footer render on every storefront route via the shared
// (storefront)/layout.tsx, and product/collection pages cache for up to an
// hour (next: { revalidate: 3600 }) — a plain revalidatePath("/") would
// leave those routes showing stale nav for up to that long. The "layout"
// revalidation invalidates every route sharing that layout. Hero only
// renders on the homepage itself, so page-level revalidation is enough.
function revalidateForLocation(location: NavLocation, parentId?: string | null) {
  revalidatePath(`/store-settings/site-navigation/${location}`);
  if (parentId) {
    revalidatePath(`/store-settings/site-navigation/header/${parentId}/submenu`);
  }
  if (location === "hero") {
    revalidatePath("/");
  } else {
    revalidatePath("/", "layout");
  }
}

// Children live under a dropdown's submenu subpage, not the flat list.
function redirectTargetFor(input: NavItemInput): string {
  return input.parentId
    ? `/store-settings/site-navigation/header/${input.parentId}/submenu`
    : `/store-settings/site-navigation/${input.location}`;
}

export async function createNavItemAction(formData: FormData) {
  const input = parseInput(formData);
  validate(input);

  await createNavItem(input);

  revalidateForLocation(input.location);
  redirect(redirectTargetFor(input));
}

export async function updateNavItemAction(id: string, formData: FormData) {
  const input = parseInput(formData);
  validate(input);

  await updateNavItem(id, input);

  revalidateForLocation(input.location);
  redirect(redirectTargetFor(input));
}

export async function deleteNavItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const location = String(formData.get("location") ?? "") as NavLocation;
  const parentId = String(formData.get("parentId") ?? "").trim() || null;
  if (!id) throw new Error("A nav item id is required");

  await deleteNavItem(id);

  revalidateForLocation(location, parentId);
}

export async function setVisibilityAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const location = String(formData.get("location") ?? "") as NavLocation;
  const parentId = String(formData.get("parentId") ?? "").trim() || null;
  const visible = formData.get("visible") === "true";
  if (!id) throw new Error("A nav item id is required");

  await setNavItemVisible(id, visible);

  revalidateForLocation(location, parentId);
}

export async function moveNavItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const location = String(formData.get("location") ?? "") as NavLocation;
  const parentId = String(formData.get("parentId") ?? "").trim() || null;
  const direction = String(formData.get("direction") ?? "") as "up" | "down";
  if (!id) throw new Error("A nav item id is required");

  await moveNavItem(id, direction);

  revalidateForLocation(location, parentId);
}
