import Link from "next/link";
import { listNavItems, type FooterGroupLabel } from "@/lib/navItems";
import { NavItemsTable } from "@/components/admin/NavItemsTable";

// Fixed, hardcoded order — matches the footer's grid-cols-5 layout
// (logo + these 4 link columns, left to right). DB order can't be trusted
// for this (alphabetical isn't the desired order), so grouping and render
// order both come from this const, not from the query.
const FOOTER_GROUPS: FooterGroupLabel[] = ["Shop", "Learn", "Support", "Company"];

export default async function FooterNavPage() {
  const items = await listNavItems("footer");

  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-lg text-charcoal">Footer nav items</h2>
      <p className="mt-1 text-sm text-charcoal/70">
        Grouped by footer column, in the order they appear on the site. New
        footer groups/columns aren&apos;t supported — the footer layout is
        fixed to these 4.
      </p>

      <div className="mt-6 flex flex-col gap-8">
        {FOOTER_GROUPS.map((group) => (
          <div key={group}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gold">
                {group}
              </h3>
              <Link
                href={`/store-settings/site-navigation/footer/new?group=${encodeURIComponent(group)}`}
                className="text-xs font-medium text-charcoal/70 underline hover:text-charcoal"
              >
                + New in {group}
              </Link>
            </div>
            <div className="mt-2">
              <NavItemsTable
                items={items.filter((item) => item.groupLabel === group)}
                location="footer"
                emptyMessage={`No items in ${group} yet.`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
