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
  parentId: string | null;
  columnIndex: number | null;
  isDropdown: boolean;
  columnCount: number | null;
  columnHeadings: string[];
  /** Populated only for top-level header dropdown items, by
   * getVisibleNavItems/listNavItemChildren consumers — always [] otherwise. */
  children: NavItem[];
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
  // Only selected when location === "header" (see columnsFor) — absent
  // (undefined) rather than null when not selected, e.g. for footer/hero
  // rows fetched before migration 0013 has been run.
  parent_id?: string | null;
  column_index?: number | null;
  is_dropdown?: boolean;
  column_count?: number | null;
  column_headings?: string[];
}

const BASE_COLUMNS =
  "id, location, group_label, title, href, variant, dimmed, visible, sort_order";
const DROPDOWN_COLUMNS =
  "parent_id, column_index, is_dropdown, column_count, column_headings";
const ALL_COLUMNS = `${BASE_COLUMNS}, ${DROPDOWN_COLUMNS}`;

// Footer/hero never need the dropdown-only columns, so their queries don't
// select them — meaning if migration 0013 hasn't been run yet, footer/hero
// nav keeps working exactly as before; only header's dropdown-aware fetch
// would be affected (and getVisibleNavItems still fails soft either way).
function columnsFor(location: NavLocation): string {
  return location === "header" ? ALL_COLUMNS : BASE_COLUMNS;
}

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
    parentId: row.parent_id ?? null,
    columnIndex: row.column_index ?? null,
    isDropdown: row.is_dropdown ?? false,
    columnCount: row.column_count ?? null,
    columnHeadings: Array.isArray(row.column_headings) ? row.column_headings : [],
    children: [],
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
    let query = admin
      .from("nav_items")
      .select(columnsFor(location))
      .eq("location", location)
      .eq("visible", true);
    // Only header rows can have parent_id set (children live under a
    // dropdown parent) — that column doesn't exist at all until migration
    // 0013 runs, so this filter must not be applied for footer/hero, which
    // never need it, to keep them working regardless of 0013's status.
    if (location === "header") {
      query = query.is("parent_id", null);
    }
    const { data, error } = await query
      .order("sort_order", { ascending: true })
      .returns<NavItemRow[]>();

    if (error) throw error;
    const items = (data ?? []).map(toNavItem);

    const dropdownIds = items.filter((item) => item.isDropdown).map((item) => item.id);
    if (dropdownIds.length === 0) return items;

    const { data: childRows, error: childError } = await admin
      .from("nav_items")
      .select(ALL_COLUMNS)
      .in("parent_id", dropdownIds)
      .eq("visible", true)
      .order("column_index", { ascending: true })
      .order("sort_order", { ascending: true })
      .returns<NavItemRow[]>();
    if (childError) throw childError;

    const children = (childRows ?? []).map(toNavItem);
    return items.map((item) =>
      item.isDropdown
        ? { ...item, children: children.filter((child) => child.parentId === item.id) }
        : item
    );
  } catch (error) {
    console.error(`getVisibleNavItems("${location}") failed:`, error);
    return [];
  }
}

// Admin-only — top-level items for a location's Site Navigation list
// screen. Dropdown children are managed separately via
// listNavItemChildren/the submenu subpage, not mixed into this list.
export async function listNavItems(location: NavLocation): Promise<NavItem[]> {
  await requireAdminSession();

  const admin = createAdminClient();
  let query = admin
    .from("nav_items")
    .select(columnsFor(location))
    .eq("location", location);
  if (location === "header") {
    query = query.is("parent_id", null);
  }
  const { data, error } = await query
    .order("sort_order", { ascending: true })
    .returns<NavItemRow[]>();

  if (error) throw error;
  return (data ?? []).map(toNavItem);
}

// Admin-only — every child link under a dropdown parent, for the submenu
// management subpage.
export async function listNavItemChildren(parentId: string): Promise<NavItem[]> {
  await requireAdminSession();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("nav_items")
    .select(ALL_COLUMNS)
    .eq("parent_id", parentId)
    .order("column_index", { ascending: true })
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
    .select(ALL_COLUMNS)
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
  parentId: string | null;
  columnIndex: number | null;
  isDropdown: boolean;
  columnCount: number | null;
  columnHeadings: string[];
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
      parent_id: input.parentId,
      column_index: input.columnIndex,
      is_dropdown: input.isDropdown,
      column_count: input.columnCount,
      column_headings: input.columnHeadings,
      updated_by: user.id,
    })
    .select(ALL_COLUMNS)
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
      parent_id: input.parentId,
      column_index: input.columnIndex,
      is_dropdown: input.isDropdown,
      column_count: input.columnCount,
      column_headings: input.columnHeadings,
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
// direction, scoped to items sharing the same (location, group_label,
// parent_id, column_index) — e.g. reordering within the footer's "Shop"
// column doesn't touch "Learn", and reordering a dropdown's column-2
// children doesn't touch column 1 or its siblings. No-op if already at the
// boundary (first item + "up", last item + "down").
export async function moveNavItem(
  id: string,
  direction: "up" | "down"
): Promise<void> {
  await requireAdminSession();

  const admin = createAdminClient();

  const { data: item, error: itemError } = await admin
    .from("nav_items")
    .select("id, location, group_label, sort_order, parent_id, column_index")
    .eq("id", id)
    .single<
      Pick<
        NavItemRow,
        "id" | "location" | "group_label" | "sort_order" | "parent_id" | "column_index"
      >
    >();
  if (itemError) throw itemError;

  let siblingsQuery = admin
    .from("nav_items")
    .select("id, sort_order")
    .eq("location", item.location);
  siblingsQuery =
    item.group_label === null
      ? siblingsQuery.is("group_label", null)
      : siblingsQuery.eq("group_label", item.group_label);
  siblingsQuery =
    item.parent_id == null
      ? siblingsQuery.is("parent_id", null)
      : siblingsQuery.eq("parent_id", item.parent_id);
  siblingsQuery =
    item.column_index == null
      ? siblingsQuery.is("column_index", null)
      : siblingsQuery.eq("column_index", item.column_index);

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
