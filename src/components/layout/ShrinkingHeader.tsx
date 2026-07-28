"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { leftNav, rightNav, type NavItem } from "@/lib/navigation";
import { MobileNav } from "./MobileNav";
import { SearchInput } from "./SearchInput";

export const HEADER_MAX = 200;
const HEADER_MIN = 125;
const LOGO_MAX = 200;
const LOGO_MIN = 120;
const SHRINK_DISTANCE = 200;

function NavLink({ item }: { item: NavItem }) {
  if (!item.href) {
    // TODO(owner): no real destination yet — inert until it exists
    // (SSES-010: no dead links).
    return <span className="cursor-default opacity-70">{item.label}</span>;
  }
  return (
    <Link href={item.href} className="transition-colors hover:text-gold">
      {item.label}
    </Link>
  );
}

export function ShrinkingHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const leftNavRef = useRef<HTMLElement>(null);
  const rightGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const header = headerRef.current;
    const logoWrap = logoWrapRef.current;
    const leftNavEl = leftNavRef.current;
    const rightGroupEl = rightGroupRef.current;
    if (!header || !logoWrap || !leftNavEl || !rightGroupEl) return;

    if (prefersReducedMotion) {
      // Skip the scroll-linked effect entirely: land directly on the
      // compact, settled state rather than animating into it.
      header.style.height = `${HEADER_MIN}px`;
      logoWrap.style.height = `${LOGO_MIN}px`;
      logoWrap.style.top = `${HEADER_MIN / 2 - LOGO_MIN / 2}px`;
      leftNavEl.style.opacity = "1";
      rightGroupEl.style.opacity = "1";
      return;
    }

    let ticking = false;

    function apply() {
      const progress = Math.min(
        1,
        Math.max(0, window.scrollY / SHRINK_DISTANCE)
      );
      const headerHeight = HEADER_MAX + (HEADER_MIN - HEADER_MAX) * progress;
      const logoHeight = LOGO_MAX + (LOGO_MIN - LOGO_MAX) * progress;
      // Always centered within the current header height — vertically and
      // horizontally centered at rest, not straddling the header/hero seam.
      const logoCenter = headerHeight / 2;

      header!.style.height = `${headerHeight}px`;
      logoWrap!.style.height = `${logoHeight}px`;
      logoWrap!.style.top = `${logoCenter - logoHeight / 2}px`;
      leftNavEl!.style.opacity = `${Math.max(0.001, progress)}`;
      rightGroupEl!.style.opacity = `${Math.max(0.001, progress)}`;
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
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 overflow-visible bg-charcoal"
      style={{ height: HEADER_MAX }}
    >
      <MobileNav />

      <div className="relative mx-auto flex h-full max-w-[1600px] items-end justify-between px-4 sm:px-8">
        <nav
          ref={leftNavRef}
          aria-label="Primary"
          style={{ opacity: 0.001 }}
          className="hidden lg:block"
        >
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-4 text-sm font-medium text-cream">
            {leftNav.map((item) => (
              <li key={item.label}>
                <NavLink item={item} />
              </li>
            ))}
          </ul>
        </nav>

        <div
          ref={rightGroupRef}
          style={{ opacity: 0.001 }}
          className="hidden flex-col items-end gap-2 pb-4 lg:flex"
        >
          <div className="flex items-center gap-4 text-xs font-medium text-cream">
          {/* SEARCH BAR INPUT - TODO(owner): create search funcitonality across entire site w/ blog inclusion if possible. */}
            <SearchInput className="w-48 rounded border border-cream/30 bg-transparent px-2 py-1 text-xs text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none" />
          {/* LOGIN/CART NAV - TODO(owner): no account/cart system built yet — inert. */}
            <span className="cursor-default opacity-70">Login</span>
            <span className="cursor-default opacity-70">Cart</span>
          </div>

          <nav aria-label="Secondary">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-cream">
              {rightNav.map((item) => (
                <li key={item.label}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </nav>

          
        </div>
      </div>

      <div
        ref={logoWrapRef}
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{ top: HEADER_MAX / 2 - LOGO_MAX / 2, height: LOGO_MAX }}
      >
        <Link
          href="/"
          aria-label="Soothing Saunas — Home"
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
      </div>
    </header>
  );
}
