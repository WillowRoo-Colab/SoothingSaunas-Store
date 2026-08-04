import Link from "next/link";
import type { NavItem, NavLocation } from "@/lib/navItems";
import { ConfirmSubmitButton } from "./ConfirmSubmitButton";
import { SubmitButton } from "./SubmitButton";
import {
  deleteNavItemAction,
  setVisibilityAction,
  moveNavItemAction,
} from "@/app/store-settings/(dashboard)/site-navigation/actions";

const ACTION_LINK_CLASS =
  "text-xs font-medium text-charcoal/70 underline hover:text-charcoal";

// Shared list table for all Site Navigation screens (Header top-level
// items, a dropdown's per-column children, Footer — called once per
// column, Hero). Every mutation is a real server action + revalidatePath
// (see ../actions.ts) — no client state.
export function NavItemsTable({
  items,
  location,
  emptyMessage = "No nav items yet.",
  parentId,
}: {
  items: NavItem[];
  location: NavLocation;
  emptyMessage?: string;
  /** Set when rendering a dropdown's children, so mutations also
   * revalidate that dropdown's submenu admin page. */
  parentId?: string;
}) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-silver text-charcoal/60">
          <th className="py-2 pr-4 font-medium">Title</th>
          <th className="py-2 pr-4 font-medium">Destination</th>
          <th className="py-2 pr-4 font-medium">Status</th>
          <th className="py-2 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={item.id} className="border-b border-silver/60">
            <td className="py-2 pr-4">{item.title}</td>
            <td className="py-2 pr-4 font-mono text-xs">
              {item.isDropdown
                ? `Dropdown · ${item.columnCount} column${item.columnCount === 1 ? "" : "s"}`
                : item.href}
            </td>
            <td className="py-2 pr-4">{item.visible ? "Visible" : "Hidden"}</td>
            <td className="py-2">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/store-settings/site-navigation/${location}/${item.id}`}
                  className={ACTION_LINK_CLASS}
                >
                  Edit
                </Link>

                {item.isDropdown ? (
                  <Link
                    href={`/store-settings/site-navigation/header/${item.id}/submenu`}
                    className={ACTION_LINK_CLASS}
                  >
                    Manage submenu
                  </Link>
                ) : null}

                <form action={setVisibilityAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="location" value={location} />
                  {parentId ? (
                    <input type="hidden" name="parentId" value={parentId} />
                  ) : null}
                  <input
                    type="hidden"
                    name="visible"
                    value={(!item.visible).toString()}
                  />
                  <SubmitButton
                    pendingText="…"
                    className={ACTION_LINK_CLASS}
                  >
                    {item.visible ? "Hide Item" : "Unhide"}
                  </SubmitButton>
                </form>

                {index > 0 ? (
                  <form action={moveNavItemAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="location" value={location} />
                    {parentId ? (
                      <input type="hidden" name="parentId" value={parentId} />
                    ) : null}
                    <input type="hidden" name="direction" value="up" />
                    <SubmitButton pendingText="…" className={ACTION_LINK_CLASS}>
                      Move up
                    </SubmitButton>
                  </form>
                ) : null}

                {index < items.length - 1 ? (
                  <form action={moveNavItemAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="location" value={location} />
                    {parentId ? (
                      <input type="hidden" name="parentId" value={parentId} />
                    ) : null}
                    <input type="hidden" name="direction" value="down" />
                    <SubmitButton pendingText="…" className={ACTION_LINK_CLASS}>
                      Move down
                    </SubmitButton>
                  </form>
                ) : null}

                <form action={deleteNavItemAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="location" value={location} />
                  {parentId ? (
                    <input type="hidden" name="parentId" value={parentId} />
                  ) : null}
                  <ConfirmSubmitButton
                    confirmMessage={
                      item.isDropdown
                        ? `Delete "${item.title}"? This will also delete its entire submenu. This can't be undone.`
                        : `Delete "${item.title}"? This can't be undone.`
                    }
                    className="text-xs font-medium text-red-600 underline hover:text-red-700"
                  >
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </td>
          </tr>
        ))}
        {items.length === 0 ? (
          <tr>
            <td colSpan={4} className="py-6 text-center text-charcoal/50">
              {emptyMessage}
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}
