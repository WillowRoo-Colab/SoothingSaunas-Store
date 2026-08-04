import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getTickerByPlacement } from "@/lib/scrollingTickers";
import { getVisibleNavItems } from "@/lib/navItems";

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [homepageTicker, headerNavItems, footerNavItems] = await Promise.all([
    getTickerByPlacement("homepage-top"),
    getVisibleNavItems("header"),
    getVisibleNavItems("footer"),
  ]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-charcoal"
      >
        Skip to main content
      </a>
      <SiteHeader ticker={homepageTicker} navItems={headerNavItems} />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter navItems={footerNavItems} />
    </>
  );
}
