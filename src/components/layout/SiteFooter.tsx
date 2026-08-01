import Image from "next/image";
import Link from "next/link";

// Every other footer link is still a decorative placeholder (see SSES-010 —
// no dead links yet since the real pages don't exist). "Admin" is the one
// real destination today.
const LINK_HREFS: Partial<Record<string, string>> = {
  Admin: "/store-settings",
};

const COLUMNS = [
  {
    heading: "Shop",
    links: ["Saunas", "Cold & Water", "Wellness", "Accessories"],
  },
  {
    heading: "Learn",
    links: ["Buying Guides", "Wellness Education", "Find Your Fit Quiz"],
  },
  {
    heading: "Support",
    links: ["Contact", "Shipping", "Returns", "Warranty"],
  },
  {
    heading: "Company",
    links: ["About Us", "Privacy", "Terms", "Accessibility", "Sitemap", "Admin"],
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gold/30 bg-charcoal py-16 text-[#f7f1e5]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <Image
          src="/Gold-Transparent-LogoWords.png"
          alt="Soothing Saunas"
          width={924}
          height={563}
          className="h-10 w-auto"
        />

        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold">
                {col.heading}
              </p>
              <ul className="mt-4 space-y-2 text-sm opacity-85">
                {col.links.map((link) => {
                  const href = LINK_HREFS[link];
                  return (
                    <li key={link}>
                      {href ? (
                        <Link
                          href={href}
                          className="opacity-60 transition-opacity hover:text-gold hover:opacity-100"
                        >
                          {link}
                        </Link>
                      ) : (
                        <span className="cursor-default hover:text-gold">
                          {link}
                        </span>
                      )}
                    </li>
                  );
                })}
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
