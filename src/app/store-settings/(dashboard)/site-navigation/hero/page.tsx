import Link from "next/link";
import { listNavItems } from "@/lib/navItems";
import { NavItemsTable } from "@/components/admin/NavItemsTable";

export default async function HeroNavPage() {
  const items = await listNavItems("hero");

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-charcoal">Hero buttons</h2>
        <Link
          href="/store-settings/site-navigation/hero/new"
          className="rounded bg-charcoal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
        >
          + New item
        </Link>
      </div>
      <p className="mt-1 text-sm text-charcoal/70">
        The call-to-action buttons on the homepage hero, in order.
      </p>

      <div className="mt-6">
        <NavItemsTable
          items={items}
          location="hero"
          emptyMessage="No hero buttons yet."
        />
      </div>
    </div>
  );
}
