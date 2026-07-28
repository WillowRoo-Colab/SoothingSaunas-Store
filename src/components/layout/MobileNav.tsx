"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { leftNav, rightNav, type NavItem } from "@/lib/navigation";
import { SearchInput } from "./SearchInput";

function MobileNavLink({
  item,
  onClick,
}: {
  item: NavItem;
  onClick: () => void;
}) {
  if (!item.href) {
    // TODO(owner): no real destination yet — inert until it exists
    // (SSES-010: no dead links).
    return <span className="cursor-default opacity-50">{item.label}</span>;
  }
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="transition-colors hover:text-gold"
    >
      {item.label}
    </Link>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
        className="absolute right-4 top-1/2 z-[70] flex h-10 w-10 -translate-y-1/2 flex-col items-center justify-center gap-1.5 sm:right-8"
      >
        <span
          className={`h-px w-6 bg-cream transition-transform ${
            open ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`h-px w-6 bg-cream transition-opacity ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-px w-6 bg-cream transition-transform ${
            open ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[60] flex flex-col gap-8 overflow-y-auto bg-charcoal px-6 pb-10 pt-24 text-cream"
        >
          <nav aria-label="Primary">
            <ul className="flex flex-col gap-5 text-lg font-medium">
              {[...leftNav, ...rightNav].map((item) => (
                <li key={item.label}>
                  <MobileNavLink item={item} onClick={() => setOpen(false)} />
                </li>
              ))}
            </ul>
          </nav>

          <SearchInput className="w-full rounded border border-cream/30 bg-transparent px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none" />

          <div className="flex items-center gap-6 text-sm font-medium">
            {/* TODO(owner): no account/cart system built yet — inert. */}
            <span className="cursor-default opacity-70">Login</span>
            <span className="cursor-default opacity-70">Cart</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
