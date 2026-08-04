import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminSession } from "@/lib/supabase/auth";

export type NavLocation = "header" | "footer" | "hero";
export type NavItemVariant = "primary-dark" | "outline-dark";
export type FooterGroupLabel = "Shop" | "Learn" | "Support" | "Company";

export interface NavItem {
  id: string;
  location: NavLocation;
  groupLabel: FooterGroupLabel | null;
  title: string;
  href: string;
  variant: NavItemVariant | null;
  dimmed: boolean;
  visible: boolean;
  sortOrder: number;
}

interface NavItemRow {
  id: string;
  location: NavLocation;
  group_label: FooterGroupLabel | null;
  title: string;
  href: string;
  variant: NavItemVariant | null;
  dimmed: boolean;
  visible: boolean;
  sort_order: number;
}

const COLUMNS =
  "id, location, group_label, title, href, variant, dimmed, visible, sort_order";

function toNavItem(row: NavItemRow): NavItem {
  return {
    id: row.id,
    location: row.location,
    groupLabel: row.group_label,
    title: row.title,
    href: row.href,
    variant: row.variant,
    dimmed: row.dimmed,
    visible: row.visible,
    sortOrder: row.sort_order,
  };
}

// Public read — no admin session required. Used by every storefront page
// (header/footer render via the shared (storefront)/layout.tsx, hero via
// the homepage). Fails soft — log + return an empty list — rather than
// throwing, the same way getTickerByPlacement does: a broken nav fetch
// must never 500 every route on the site. An empty list just means the
// affected nav renders with fewer items (or none) until the issue clears,
// instead of taking the whole storefront down.
export async function getVisibleNavItems(
  location: NavLocation
): Promise<NavItem[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("nav_items")
      .select(COLUMNS)
      .eq("location", location)
      .eq("visible", true)
      .order("sort_order", { ascending: true })
      .returns<NavItemRow[]>();

    if (error) throw error;
    return (data ?? []).map(toNavItem);
  } catch (error) {
    console.error(`getVisibleNavItems("${location}") failed:`, error);
    return [];
  }
}

// Admin-only — every instance, for the Site Navigation list screens.
export async function listNavItems(location: NavLocation): Promise<NavItem[]> {
  await requireAdminSession();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("nav_items")
    .select(COLUMNS)
    .eq("location", location)
    .order("sort_order", { ascending: true })
    .returns<NavItemRow[]>();

  if (error) throw error;
  return (data ?? []).map(toNavItem);
}

export async function getNavItem(id: string): Promise<NavItem | null> {
  await requireAdminSession();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("nav_items")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle<NavItemRow>();

  if (error) throw error;
  return data ? toNavItem(data) : null;
}

export interface NavItemInput {
  location: NavLocation;
  groupLabel: FooterGroupLabel | null;
  title: string;
  href: string;
  variant: NavItemVariant | null;
  dimmed: boolean;
  visible: boolean;
}

export async function createNavItem(input: NavItemInput): Promise<NavItem> {
  const { user } = await requireAdminSession();

  const admin = createAdminClient();

  // New items go to the end of their (location, group) list.
  const { data: siblings, error: siblingsError } = await admin
    .from("nav_items")
    .select("sort_order")
    .eq("location", input.location)
    .order("sort_order", { ascending: false })
    .limit(1);
  if (siblingsError) throw siblingsError;
  const nextSortOrder = (siblings?.[0]?.sort_order ?? 0) + 10;

  const { data, error } = await admin
    .from("nav_items")
    .insert({
      location: input.location,
      group_label: input.groupLabel,
      title: input.title,
      href: input.href,
      variant: input.variant,
      dimmed: input.dimmed,
      visible: input.visible,
      sort_order: nextSortOrder,
      updated_by: user.id,
    })
    .select(COLUMNS)
    .single<NavItemRow>();

  if (error) throw error;
  return toNavItem(data);
}

export async function updateNavItem(
  id: string,
  input: NavItemInput
): Promise<void> {
  const { user } = await requireAdminSession();

  const admin = createAdminClient();
  const { error } = await admin
    .from("nav_items")
    .update({
      group_label: input.groupLabel,
      title: input.title,
      href: input.href,
      variant: input.variant,
      dimmed: input.dimmed,
      visible: input.visible,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteNavItem(id: string): Promise<void> {
  await requireAdminSession();

  const admin = createAdminClient();
  const { error } = await admin.from("nav_items").delete().eq("id", id);
  if (error) throw error;
}

export async function setNavItemVisible(
  id: string,
  visible: boolean
): Promise<void> {
  const { user } = await requireAdminSession();

  const admin = createAdminClient();
  const { error } = await admin
    .from("nav_items")
    .update({
      visible,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) throw error;
}

// Swaps this item's sort_order with its neighbor in the requested
// direction, scoped to items sharing the same (location, group_label) —
// e.g. reordering within the footer's "Shop" column doesn't touch "Learn".
// No-op if already at the boundary (first item + "up", last item + "down").
export async function moveNavItem(
  id: string,
  direction: "up" | "down"
): Promise<void> {
  await requireAdminSession();

  const admin = createAdminClient();

  const { data: item, error: itemError } = await admin
    .from("nav_items")
    .select("id, location, group_label, sort_order")
    .eq("id", id)
    .single<Pick<NavItemRow, "id" | "location" | "group_label" | "sort_order">>();
  if (itemError) throw itemError;

  let siblingsQuery = admin
    .from("nav_items")
    .select("id, sort_order")
    .eq("location", item.location);
  siblingsQuery =
    item.group_label === null
      ? siblingsQuery.is("group_label", null)
      : siblingsQuery.eq("group_label", item.group_label);

  const { data: siblings, error: siblingsError } = await siblingsQuery.order(
    "sort_order",
    { ascending: true }
  );
  if (siblingsError) throw siblingsError;
  if (!siblings) return;

  const index = siblings.findIndex((sibling) => sibling.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= siblings.length) return;

  const neighbor = siblings[swapIndex];
  const current = siblings[index];

  const { error: firstUpdateError } = await admin
    .from("nav_items")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", current.id);
  if (firstUpdateError) throw firstUpdateError;

  const { error: secondUpdateError } = await admin
    .from("nav_items")
    .update({ sort_order: current.sort_order })
    .eq("id", neighbor.id);
  if (secondUpdateError) throw secondUpdateError;
}
