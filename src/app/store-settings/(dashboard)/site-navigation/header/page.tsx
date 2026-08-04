import Link from "next/link";
import { listNavItems } from "@/lib/navItems";
import { NavItemsTable } from "@/components/admin/NavItemsTable";

export default async function HeaderNavPage() {
  const items = await listNavItems("header");

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-charcoal">Header nav items</h2>
        <Link
          href="/store-settings/site-navigation/header/new"
          className="rounded bg-charcoal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
        >
          + New item
        </Link>
      </div>
      <p className="mt-1 text-sm text-charcoal/70">
        &quot;Saunas&quot; isn&apos;t listed here — it opens a hover menu
        rather than linking anywhere, so it isn&apos;t editable.
      </p>

      <div className="mt-6">
        <NavItemsTable
          items={items}
          location="header"
          emptyMessage="No header nav items yet."
        />
      </div>
    </div>
  );
}
