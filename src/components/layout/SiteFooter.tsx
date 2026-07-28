import Link from "next/link";
import { footerNav } from "@/lib/navigation";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-charcoal text-cream">
      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-8">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {footerNav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href!}
                  className="transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-8 text-xs text-silver">
          &copy; {year} Soothing Saunas. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
