export function collectionHref(handle: string): string {
  return `/collections/${handle}`;
}

export interface NavItem {
  label: string;
  href?: string;
}

// Left of the centered logo.
export const leftNav: NavItem[] = [
  { label: "Saunas", href: collectionHref("all-saunas") },
  { label: "Heaters", href: collectionHref("all-heaters") },
  { label: "Plunges", href: collectionHref("plunges") },
  // TODO(owner): no "Showers" collection exists in Shopify yet — inert
  // until one is created (SSES-010: no dead links).
  { label: "Showers" },
];

// Right of the centered logo.
export const rightNav: NavItem[] = [
  { label: "Mind & Body Wellness", href: collectionHref("mind-body-wellness") },
  // TODO(owner): needs a real brands/collections hub page once it exists.
  { label: "Brands & Collections" },
  // TODO(owner): needs a real About page once it exists.
  { label: "About Us" },
];

// Used by the footer — only items with a real destination today.
export const footerNav: NavItem[] = [...leftNav, ...rightNav].filter(
  (item) => item.href
);

// Homepage "Shop by Category" grid — a distinct content decision from the
// header nav, not the same list (header now includes non-collection items
// like About Us).
export const featuredCollectionHandles = [
  "all-saunas",
  "all-heaters",
  "plunges",
  "accessories-sauna",
] as const;
