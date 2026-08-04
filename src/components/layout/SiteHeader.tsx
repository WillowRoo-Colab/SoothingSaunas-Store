"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ScrollingTicker as ScrollingTickerData } from "@/lib/scrollingTickers";
import { ScrollingTicker } from "@/components/site/ScrollingTicker";

const ANNOUNCEMENTS = [
  "Questions before you choose? Call (504) 285-9552.",
  "Explore saunas, cold therapy, outdoor wellness, and recovery.",
  "Wellness guidance without the pressure.",
];

const PRIMARY_NAV = [
  { label: "Saunas", megaMenu: true },
  { label: "Cold & Water", megaMenu: false },
  { label: "Wellness", megaMenu: false },
  { label: "Accessories", megaMenu: false },
  { label: "Learn", megaMenu: false },
  { label: "Find Your Fit", megaMenu: false },
] as const;

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

export function SiteHeader({ ticker }: { ticker: ScrollingTickerData | null }) {
  const pathname = usePathname();
  // The shrink/fade-in transition is a homepage-only effect (the header
  // starts transparent over the cinematic hero); every other page renders
  // the header already in its settled, final-phase state.
  const animated = pathname === "/";

  const [scrolled, setScrolled] = useState(!animated);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

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

    if (
      !animated ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      logo.style.height = `${LOGO_MIN}px`;
      return;
    }

    let ticking = false;

    function apply() {
      const progress = Math.min(
        1,
        Math.max(0, window.scrollY / SHRINK_DISTANCE)
      );
      const height = LOGO_MAX + (LOGO_MIN - LOGO_MAX) * progress;
      logo!.style.height = `${height}px`;
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
                animated logo is the absolutely positioned element below. */}
            <div aria-hidden className="invisible w-[97px] shrink-0" />

            <nav aria-label="Primary" className="hidden lg:block">
              <ul
                className={`flex items-center gap-7 text-sm transition-colors duration-300 ${
                  scrolled ? "font-bold text-gold" : "font-medium text-[#f7f1e5]"
                }`}
              >

                {PRIMARY_NAV.map((item) => (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() =>
                      setOpenMenu(item.megaMenu ? item.label : null)
                    }
                  >
                    <button
                      type="button"
                      aria-expanded={
                        item.megaMenu ? openMenu === item.label : undefined
                      }
                      onClick={() =>
                        setOpenMenu((current) =>
                          item.megaMenu
                            ? current === item.label
                              ? null
                              : item.label
                            : current
                        )
                      }
                      className="cursor-default py-2 transition-colors hover:text-gold focus-visible:text-gold"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden items-center gap-5 text-xs font-bold text-[#f7f1e5] lg:flex">
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
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
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
            <div className="border-t border-gold/20 bg-charcoal px-6 py-6 lg:hidden">
              <ul className="flex flex-col gap-4 text-base font-medium text-[#f7f1e5]">
                {PRIMARY_NAV.map((item) => (
                  <li key={item.label}>
                    <span className="cursor-default opacity-90">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {openMenu === "Saunas" ? (
            <div className="border-t border-gold/20 bg-charcoal">
              <div className="mx-auto grid max-w-[1440px] grid-cols-3 gap-8 px-8 py-8">
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
