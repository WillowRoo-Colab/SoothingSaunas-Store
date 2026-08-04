"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ScrollingTicker as ScrollingTickerData } from "@/lib/scrollingTickers";
import { ScrollingTicker } from "@/components/site/ScrollingTicker";
import type { NavItem } from "@/lib/navItems";

const ANNOUNCEMENTS = [
  "Questions before you choose? Call (504) 285-9552.",
  "Explore saunas, cold therapy, outdoor wellness, and recovery.",
  "Wellness guidance without the pressure.",
];

// "Saunas" is a hover mega-menu trigger, not a plain link — it stays
// hardcoded and isn't part of the admin-editable Site Navigation items
// (see src/lib/navItems.ts). Every other header item comes from the
// `navItems` prop, fetched live in (storefront)/layout.tsx.
const SAUNAS_TRIGGER_LABEL = "Saunas";

const SAUNA_MEGA_MENU = {
  "Shop by Type": ["Infrared", "Traditional", "Steam", "Outdoor", "Specialty"],
  "Shop by Space": ["One Person", "Two Person", "Family", "Indoor", "Outdoor"],
  "Start Here": [
    "Compare Sauna Types",
    "Sauna Buying Guide",
    "Find Your Fit Quiz",
  ],
} as const;

const ANNOUNCEMENT_HEIGHT = 36; // h-9
// Header bar is a flat, slightly taller height (was 84) so the shrunk logo
// has more room to breathe at rest.
const HEADER_HEIGHT = 90;
// Anchor point for the logo's top edge — matches where it visually sat when
// it was a static 40px logo centered in the original 84px bar. This point
// never moves; only the logo's height animates around it.
const LOGO_TOP = 5;
const LOGO_MAX = 175; // 2.5x the original 40px, at rest on page load
const LOGO_MIN = 80; // taller than the original 40px once fully shrunk
const SHRINK_DISTANCE = 200;
// Logo's intrinsic aspect ratio (924x563 source), used to derive its
// rendered width from its animated height so the nav spacer can track it.
const LOGO_ASPECT = 924 / 563;
// The logo sits at left-[52px] from the header edge while this row's own
// padding (sm:px-8) starts its content at 32px — the 20px gap between those,
// plus a little breathing room, is added on top of the logo's live width so
// the invisible spacer always reserves exactly enough room and nav text
// never renders on top of the logo at any viewport width.
const SPACER_LEFT_OFFSET = 20;
const SPACER_GAP = 24;

function UtilityAnnouncement() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-center bg-cream-150 px-4 text-center text-xs font-medium tracking-wide text-charcoal">
      <p aria-live="polite">{ANNOUNCEMENTS[index]}</p>
    </div>
  );
}

export function SiteHeader({
  ticker,
  navItems,
}: {
  ticker: ScrollingTickerData | null;
  navItems: NavItem[];
}) {
  const pathname = usePathname();
  // The shrink/fade-in transition is a homepage-only effect (the header
  // starts transparent over the cinematic hero); every other page renders
  // the header already in its settled, final-phase state.
  const animated = pathname === "/";

  const [scrolled, setScrolled] = useState(!animated);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated) return;

    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [animated]);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    function setHeight(height: number) {
      logo!.style.height = `${height}px`;
      const spacer = spacerRef.current;
      if (spacer) {
        spacer.style.width = `${height * LOGO_ASPECT + SPACER_LEFT_OFFSET + SPACER_GAP}px`;
      }
    }

    if (
      !animated ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setHeight(LOGO_MIN);
      return;
    }

    let ticking = false;

    function apply() {
      const progress = Math.min(
        1,
        Math.max(0, window.scrollY / SHRINK_DISTANCE)
      );
      const height = LOGO_MAX + (LOGO_MIN - LOGO_MAX) * progress;
      setHeight(height);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(apply);
        ticking = true;
      }
    }

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [animated]);

  return (
    <>
      {/* No explicit background here: the site-wide default (globals.css)
          is now charcoal, so the transparent overflow beyond the centered
          1440px column already reads as dark rather than needing its own
          patch — the only genuinely transparent phase is the homepage's
          pre-scroll header, where the hero sits behind it anyway. */}
      <div className="fixed inset-x-0 top-0 z-50">
        {animated && ticker ? (
          <div className="bg-charcoal py-1.5">
            <ScrollingTicker ticker={ticker} />
          </div>
        ) : null}
        <UtilityAnnouncement />
        <header
          className={`relative mx-auto max-w-[1440px] overflow-visible transition-colors duration-300 ${
            scrolled
              ? "border-b border-gold/30 bg-charcoal"
              : "border-b border-transparent bg-transparent"
          }`}
          style={{ height: HEADER_HEIGHT }}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <div className="relative mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-8">
            {/* Invisible spacer preserves the nav/utility layout; the real,
                animated logo is the absolutely positioned element below.
                Its width tracks the logo's live rendered width (see the
                effect above) so nav text can never render on top of the
                logo, at any viewport width or scroll position. */}
            <div
              ref={spacerRef}
              aria-hidden
              className="invisible shrink-0"
              style={{
                width:
                  (animated ? LOGO_MAX : LOGO_MIN) * LOGO_ASPECT +
                  SPACER_LEFT_OFFSET +
                  SPACER_GAP,
              }}
            />

            {/* Custom 1200px breakpoint (not lg/1024px): measured the point
                where nav + account icons stop wrapping against the logo's
                widest (unscrolled homepage) footprint, then added margin. */}
            <nav aria-label="Primary" className="hidden min-[1200px]:block">
              <ul
                className={`flex items-center gap-7 text-sm transition-colors duration-300 ${
                  scrolled ? "font-bold text-gold" : "font-medium text-[#f7f1e5]"
                }`}
              >

                <li
                  className="relative"
                  onMouseEnter={() => setOpenMenu(SAUNAS_TRIGGER_LABEL)}
                >
                  <button
                    type="button"
                    aria-expanded={openMenu === SAUNAS_TRIGGER_LABEL}
                    onClick={() =>
                      setOpenMenu((current) =>
                        current === SAUNAS_TRIGGER_LABEL
                          ? null
                          : SAUNAS_TRIGGER_LABEL
                      )
                    }
                    className="cursor-default py-2 transition-colors hover:text-gold focus-visible:text-gold"
                  >
                    {SAUNAS_TRIGGER_LABEL}
                  </button>
                </li>

                {navItems.map((item) => (
                  <li
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(null)}
                  >
                    <Link
                      href={item.href}
                      className="block py-2 transition-colors hover:text-gold focus-visible:text-gold"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden items-center gap-5 text-xs font-bold text-[#f7f1e5] min-[1200px]:flex">
              <span className="cursor-default opacity-70">Search</span>
              <span className="cursor-default opacity-70">Account</span>
              <span className="cursor-default opacity-70">Cart</span>
              <span className="cursor-default opacity-70">Support</span>
            </div>

            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 min-[1200px]:hidden"
            >
              <span
                className={`h-px w-6 bg-[#f7f1e5] transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`h-px w-6 bg-[#f7f1e5] transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px w-6 bg-[#f7f1e5] transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </div>

          <div
            ref={logoRef}
            className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 flex-col items-center sm:left-[52px] sm:translate-x-0"
            style={{ top: LOGO_TOP, height: animated ? LOGO_MAX : LOGO_MIN }}
          >
            <Link
              href="/"
              aria-label="Home"
              className="pointer-events-auto block h-full"
            >
              <Image
                src="/Gold-Transparent-LogoWords.png"
                alt="Soothing Saunas"
                width={924}
                height={563}
                priority
                className="h-full w-auto"
              />
            </Link>
            {/* Pre-scroll homepage only — matches the tall, unsettled header
                phase; disappears once the header settles into its compact
                state on scroll or on every other page. */}
            {animated && !scrolled ? (
              <p className="mt-2 whitespace-nowrap text-center text-xs font-bold uppercase tracking-[0.15em] text-gold">
                Create your place to reset
              </p>
            ) : null}
          </div>

          {mobileOpen ? (
            <div className="border-t border-gold/20 bg-charcoal px-6 py-6 min-[1200px]:hidden">
              <ul className="flex flex-col gap-4 text-base font-medium text-[#f7f1e5]">
                <li>
                  <span className="cursor-default opacity-90">
                    {SAUNAS_TRIGGER_LABEL}
                  </span>
                </li>
                {navItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="opacity-90 transition-opacity hover:opacity-100 hover:text-gold"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {openMenu === "Saunas" ? (
            <div className="border-t border-gold/20 bg-charcoal">
              <div className="mx-auto grid max-w-[640px] grid-cols-3 gap-8 px-8 py-8">
                {Object.entries(SAUNA_MEGA_MENU).map(([heading, items]) => (
                  <div key={heading}>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold">
                      {heading}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-[#f7f1e5]">
                      {items.map((label) => (
                        <li key={label}>
                          <span className="cursor-default opacity-90 transition-opacity hover:opacity-100 hover:text-gold">
                            {label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </header>
      </div>

      {/* On every page but the homepage the header renders solid/settled
          from the start (no transparent-over-hero phase), so page content
          needs a spacer to avoid sitting underneath the fixed header. */}
      {!animated ? (
        <div
          aria-hidden
          style={{ height: ANNOUNCEMENT_HEIGHT + HEADER_HEIGHT }}
        />
      ) : null}
    </>
  );
}
