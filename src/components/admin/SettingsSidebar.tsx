"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Admin Profile", href: "/store-settings" },
  { label: "Promotions", href: "/store-settings/promotions" },
  { label: "Banners", href: "/store-settings/banners" },
  { label: "Text Values", href: "/store-settings/text-values" },
  { label: "Stylings", href: "/store-settings/stylings" },
  { label: "Administrator Security", href: "/store-settings/admin-security" },
] as const;

// Curved divider between stacked tabs — flat, then a sharp rise near the
// end — so each tab reads as a folder tab nested into the one below it.
function TabDivider() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 -bottom-2.5 z-0 h-5 w-full text-silver"
    >
      <path
        d="M0,16 H78 C88,16 92,10 100,2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Settings sections"
      className="w-56 shrink-0 border-r border-silver bg-cream"
    >
      <ul className="relative py-6">
        {tabs.map((tab, index) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.href} className="relative">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`relative z-10 block py-3 pl-6 pr-4 text-left text-sm font-medium transition-colors ${
                  active
                    ? "-mr-px rounded-r-lg bg-gold text-charcoal shadow-[2px_2px_6px_rgba(0,0,0,0.15)]"
                    : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                {tab.label}
              </Link>
              {index < tabs.length - 1 ? <TabDivider /> : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
