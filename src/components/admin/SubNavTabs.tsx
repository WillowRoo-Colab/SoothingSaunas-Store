"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SubNavTab {
  label: string;
  href: string;
}

// Shared top sub-tab bar for any admin settings category (sidebar =
// category, this = the snippet/section within it). Used by both
// Administrator Security and Templates today.
export function SubNavTabs({ tabs, ariaLabel }: { tabs: SubNavTab[]; ariaLabel: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className="mt-4 flex gap-1 border-b border-silver">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "border-gold text-charcoal"
                : "border-transparent text-charcoal/60 hover:text-charcoal"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
