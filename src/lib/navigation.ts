// First-pass primary nav derived from existing Shopify collection handles.
// Only includes routes that have real content today (SSES-010: don't ship
// dead links). Learn/Support/About sections join once that content exists.
export const primaryNav = [
  { label: "Saunas", handle: "all-saunas" },
  { label: "Heaters", handle: "all-heaters" },
  { label: "Plunges", handle: "plunges" },
  { label: "Accessories", handle: "accessories-sauna" },
] as const;

export function collectionHref(handle: string): string {
  return `/collections/${handle}`;
}
