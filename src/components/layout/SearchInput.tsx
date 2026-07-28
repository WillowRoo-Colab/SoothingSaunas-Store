import { devContent } from "@/lib/dev-content";

const isProduction = process.env.NODE_ENV === "production";

// TODO(owner): not wired to anything yet — see devContent.searchInput for
// the pending scope (SSES-008). In production this renders as a plain
// empty search field with a real placeholder; in development it shows the
// dev-only default value so it's obvious it isn't live yet.
export function SearchInput({ className }: { className?: string }) {
  return (
    <input
      type="search"
      aria-label="Search"
      placeholder="Search"
      defaultValue={
        isProduction
          ? devContent.searchInput.fallback
          : devContent.searchInput.devLabel
      }
      className={className}
    />
  );
}
