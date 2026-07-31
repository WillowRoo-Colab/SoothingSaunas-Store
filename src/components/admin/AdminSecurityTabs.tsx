"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface AdminSecurityTab {
  label: string;
  href: string;
}

export function AdminSecurityTabs({ tabs }: { tabs: AdminSecurityTab[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Administrator security sections"
      className="mt-4 flex gap-1 border-b border-silver"
    >
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
