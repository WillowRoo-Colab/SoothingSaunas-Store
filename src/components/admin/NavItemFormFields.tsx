"use client";

import { useState } from "react";
import type { FooterGroupLabel, NavItem, NavItemVariant, NavLocation } from "@/lib/navItems";

const FOOTER_GROUPS: FooterGroupLabel[] = ["Shop", "Learn", "Support", "Company"];
const VARIANTS: Array<{ value: NavItemVariant; label: string }> = [
  { value: "primary-dark", label: "Primary (filled)" },
  { value: "outline-dark", label: "Outline" },
];

export function NavItemFormFields({
  location,
  navItem,
  defaultGroupLabel,
  parentId,
  columnIndex,
  parentColumnCount,
}: {
  location: NavLocation;
  navItem?: NavItem;
  /** Preselects the footer column on the "new item" form when arriving via
   * a per-column "+ New" link, e.g. ?group=Shop. Ignored once `navItem` is
   * set (editing an existing item always shows its real group). */
  defaultGroupLabel?: FooterGroupLabel;
  /** Set when creating/editing a header dropdown's child link — either
   * passed directly (new child, via ?parentId=) or read off `navItem`
   * (editing an existing child). */
  parentId?: string;
  /** Preselects the column on a new child link's form, e.g. arriving via a
   * column's own "+ New in {heading}" link. */
  columnIndex?: number;
  /** The parent dropdown's column count, for the child's column <select>. */
  parentColumnCount?: number;
}) {
  const effectiveParentId = navItem?.parentId ?? parentId ?? null;
  const isHeaderChild = location === "header" && effectiveParentId != null;
  const isHeaderTopLevel = location === "header" && !isHeaderChild;

  const [isDropdown, setIsDropdown] = useState(navItem?.isDropdown ?? false);
  const [columnCount, setColumnCount] = useState(navItem?.columnCount ?? 3);

  const columnCountOptions = Array.from(
    { length: parentColumnCount ?? 0 },
    (_, i) => i + 1
  );

  return (
    <div className="flex flex-col gap-5">
      <input type="hidden" name="location" value={location} />

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={navItem?.title}
          required
          placeholder="e.g. Wellness"
          className="rounded border border-silver px-3 py-2 text-sm"
        />
      </div>

      {isHeaderTopLevel ? (
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="isDropdown"
            defaultChecked={isDropdown}
            onChange={(e) => setIsDropdown(e.target.checked)}
          />
          Opens a dropdown menu instead of linking directly
        </label>
      ) : null}

      {!isHeaderTopLevel || !isDropdown ? (
        <div className="flex flex-col gap-1">
          <label htmlFor="href" className="text-sm font-medium">
            Destination URL
          </label>
          <input
            id="href"
            name="href"
            defaultValue={navItem?.href}
            required
            placeholder="e.g. /collections/wellness"
            className="rounded border border-silver px-3 py-2 font-mono text-sm"
          />
        </div>
      ) : null}

      {isHeaderTopLevel && isDropdown ? (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="columnCount" className="text-sm font-medium">
              Number of columns
            </label>
            <input
              id="columnCount"
              name="columnCount"
              type="number"
              min={1}
              max={4}
              value={columnCount}
              onChange={(e) =>
                setColumnCount(Math.min(4, Math.max(1, Number(e.target.value) || 1)))
              }
              className="w-20 rounded border border-silver px-3 py-2 text-sm"
            />
          </div>

          {Array.from({ length: columnCount }, (_, i) => i + 1).map((n) => (
            <div key={n} className="flex flex-col gap-1">
              <label htmlFor={`columnHeading${n}`} className="text-sm font-medium">
                Column {n} heading
              </label>
              <input
                id={`columnHeading${n}`}
                name={`columnHeading${n}`}
                defaultValue={navItem?.columnHeadings?.[n - 1] ?? ""}
                required
                placeholder="e.g. Shop by Type"
                className="rounded border border-silver px-3 py-2 text-sm"
              />
            </div>
          ))}
        </>
      ) : null}

      {isHeaderChild ? (
        <>
          <input type="hidden" name="parentId" value={effectiveParentId ?? ""} />
          <div className="flex flex-col gap-1">
            <label htmlFor="columnIndex" className="text-sm font-medium">
              Column
            </label>
            <select
              id="columnIndex"
              name="columnIndex"
              defaultValue={navItem?.columnIndex ?? columnIndex ?? 1}
              className="w-32 rounded border border-silver px-2 py-2 text-sm"
            >
              {columnCountOptions.map((n) => (
                <option key={n} value={n}>
                  Column {n}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : null}

      {location === "footer" ? (
        <div className="flex flex-col gap-1">
          <label htmlFor="groupLabel" className="text-sm font-medium">
            Footer column
          </label>
          <select
            id="groupLabel"
            name="groupLabel"
            defaultValue={navItem?.groupLabel ?? defaultGroupLabel ?? FOOTER_GROUPS[0]}
            className="rounded border border-silver px-2 py-2 text-sm"
          >
            {FOOTER_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {location === "hero" ? (
        <div className="flex flex-col gap-1">
          <label htmlFor="variant" className="text-sm font-medium">
            Button style
          </label>
          <select
            id="variant"
            name="variant"
            defaultValue={navItem?.variant ?? VARIANTS[0].value}
            className="rounded border border-silver px-2 py-2 text-sm"
          >
            {VARIANTS.map((variant) => (
              <option key={variant.value} value={variant.value}>
                {variant.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {location === "footer" ? (
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="dimmed" defaultChecked={navItem?.dimmed ?? false} />
          De-emphasize (dim) this link
        </label>
      ) : null}

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="visible" defaultChecked={navItem?.visible ?? true} />
        Visible
      </label>
    </div>
  );
}
