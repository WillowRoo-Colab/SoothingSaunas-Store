// Centralized development-only placeholder copy for guest-facing surfaces.
//
// Every entry here is scaffolding: text that stands in for real,
// SSES-009-reviewed content that hasn't been written/approved yet.
//
// - `devLabel` renders in development so it's obvious what's still pending
//   and which spec governs it.
// - `fallback` is the finalized, guest-safe copy that ships in production
//   builds if the real content still isn't ready. It MUST NOT contain any
//   of the trigger phrases checked by scripts/check-guest-content.mjs.
//
// Components should never hard-code SSES references or "pending" language
// directly — render through DevPlaceholder (src/components/dev/DevPlaceholder.tsx)
// with an entry from here instead. See SSES-000/SSES-005 on keeping
// implementation authority traceable and SSES-009 on guest-facing content
// standards.

export interface DevContentEntry {
  id: string;
  ssesReference: string;
  devLabel: string;
  fallback: string;
}

export const devContent = {
  heroCopy: {
    id: "hero-copy",
    ssesReference: "SSES-009",
    devLabel:
      "Hero copy pending — hand-off needed from SSES-009 content review.",
    fallback:
      "Considered wellness equipment, chosen with the same care you'd bring to using it.",
  },
  teaserBody: {
    id: "teaser-body",
    ssesReference: "SSES-009",
    devLabel:
      "Content pending SSES-009 review — this section will introduce Soothing Saunas as a resource for learning, not just buying.",
    fallback:
      "Soothing Saunas is built to help you understand your options, not just shop them.",
  },
  teaserLink: {
    id: "teaser-link",
    ssesReference: "SSES-010",
    devLabel: "Learn more (coming soon)",
    fallback: "Learn more",
  },
  searchInput: {
    id: "search-input",
    ssesReference: "SSES-008",
    devLabel: "need to link, not active",
    fallback: "",
  },
  addToOrderPending: {
    id: "add-to-order-pending",
    ssesReference: "SSES-006",
    devLabel: "Add to Order — cart not wired yet (Storefront Cart API pending)",
    fallback:
      "Online ordering isn't available yet — call or email to complete your order.",
  },
} as const satisfies Record<string, DevContentEntry>;

const isProduction = process.env.NODE_ENV === "production";

export function resolveContent(entry: DevContentEntry): string {
  return isProduction ? entry.fallback : entry.devLabel;
}
