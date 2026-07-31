import { requireAdminSession } from "@/lib/supabase/auth";
import { AdminSecurityTabs } from "@/components/admin/AdminSecurityTabs";

const ALL_TABS = [
  {
    label: "My Profile & 2FA",
    href: "/store-settings/admin-security/profile",
    ownerOnly: false,
  },
  {
    label: "Admins & Roles",
    href: "/store-settings/admin-security/admins",
    ownerOnly: true,
  },
  {
    label: "Textbelt SMS",
    href: "/store-settings/admin-security/textbelt",
    ownerOnly: true,
  },
  {
    label: "Login Security",
    href: "/store-settings/admin-security/login-security",
    ownerOnly: true,
  },
] as const;

export default async function AdminSecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdminSession();
  const visibleTabs = ALL_TABS.filter(
    (tab) => !tab.ownerOnly || profile.role === "owner"
  );

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Administrator Security</h1>
      <AdminSecurityTabs tabs={visibleTabs} />
      <div className="mt-6">{children}</div>
    </div>
  );
}
