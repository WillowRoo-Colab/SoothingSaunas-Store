import { requireAdminSession } from "@/lib/supabase/auth";
import { SubNavTabs } from "@/components/admin/SubNavTabs";

const TABS = [
  { label: "Header", href: "/store-settings/site-navigation/header" },
  { label: "Footer", href: "/store-settings/site-navigation/footer" },
  { label: "Hero", href: "/store-settings/site-navigation/hero" },
] as const;

export default async function SiteNavigationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Site Navigation</h1>
      <p className="mt-1 text-sm text-charcoal/70">
        Edit where each nav item points, hide it, reorder it, or add a new
        one — changes go live immediately, no deploy required.
      </p>
      <SubNavTabs tabs={[...TABS]} ariaLabel="Site navigation locations" />
      <div className="mt-6">{children}</div>
    </div>
  );
}
