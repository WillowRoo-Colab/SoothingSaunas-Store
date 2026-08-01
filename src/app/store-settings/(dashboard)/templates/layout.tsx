import { requireAdminSession } from "@/lib/supabase/auth";
import { SubNavTabs } from "@/components/admin/SubNavTabs";

const TABS = [
  { label: "Collections", href: "/store-settings/templates/collections" },
  { label: "Products", href: "/store-settings/templates/products" },
  { label: "Promos/Ads", href: "/store-settings/templates/promos-ads" },
] as const;

export default async function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Templates</h1>
      <p className="mt-1 text-sm text-charcoal/70">
        Preview the page templates used across the storefront. Selecting one
        opens an enlarged live preview of the real page.
      </p>
      <SubNavTabs tabs={[...TABS]} ariaLabel="Template categories" />
      <div className="mt-6">{children}</div>
    </div>
  );
}
