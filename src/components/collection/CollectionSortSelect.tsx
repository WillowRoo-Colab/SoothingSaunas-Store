"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
  { value: "newest", label: "Newest" },
  { value: "alphabetical-az", label: "Alphabetical: A-Z" },
  { value: "alphabetical-za", label: "Alphabetical: Z-A" },
] as const;

export function CollectionSortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-cream/80">
      Sort by:
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded border border-gold/30 bg-charcoal px-2 py-1 text-sm text-cream focus:border-gold focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
