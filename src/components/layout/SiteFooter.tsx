import Image from "next/image";
import Link from "next/link";
import type { NavItem, FooterGroupLabel } from "@/lib/navItems";

// Fixed, hardcoded order — matches the footer's grid-cols-5 layout (logo +
// these 4 link columns, left to right). Item order/destinations/visibility
// are admin-editable (Site Navigation → Footer); the 4 columns themselves
// are not.
const FOOTER_GROUPS: FooterGroupLabel[] = ["Shop", "Learn", "Support", "Company"];

export function SiteFooter({ navItems }: { navItems: NavItem[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gold/30 bg-charcoal py-16 text-[#f7f1e5]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">
          <div className="col-span-2 sm:col-span-1">
            <Image
              src="/Gold-Transparent-LogoWords.png"
              alt="Soothing Saunas"
              width={924}
              height={563}
              className="h-14 w-auto"
            />
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group}>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold">
                {group}
              </p>
              <ul className="mt-4 space-y-2 text-sm opacity-85">
                {navItems
                  .filter((item) => item.groupLabel === group)
                  .map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className={
                          item.dimmed
                            ? "opacity-60 transition-opacity hover:text-gold hover:opacity-100"
                            : "transition-colors hover:text-gold"
                        }
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-cream/10 pt-6 text-sm opacity-80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <a href="tel:+15042859552" className="hover:text-gold">
              (504) 285-9552
            </a>{" "}
            ·{" "}
            <a
              href="mailto:support@soothingsaunas.com"
              className="hover:text-gold"
            >
              support@soothingsaunas.com
            </a>
          </p>
          <p>&copy; {year} Soothing Saunas. All rights reserved.</p>
        </div>

        <p className="mt-6 font-heading text-sm italic opacity-90">
          Restoration is personal. Your space should be too.
        </p>
      </div>
    </footer>
  );
}
