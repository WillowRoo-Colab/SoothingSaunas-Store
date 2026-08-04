"use client";

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
}: {
  location: NavLocation;
  navItem?: NavItem;
  /** Preselects the footer column on the "new item" form when arriving via
   * a per-column "+ New" link, e.g. ?group=Shop. Ignored once `navItem` is
   * set (editing an existing item always shows its real group). */
  defaultGroupLabel?: FooterGroupLabel;
}) {
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
