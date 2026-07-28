import type { DevContentEntry } from "@/lib/dev-content";

const isProduction = process.env.NODE_ENV === "production";

// Renders finalized fallback copy in production. In development, renders
// the dev-only label with a visible badge so it's unmistakable as
// scaffolding rather than approved guest-facing content. See
// src/lib/dev-content.ts for the governing data and SSES reference.
export function DevPlaceholder({ entry }: { entry: DevContentEntry }) {
  if (isProduction) {
    return <>{entry.fallback}</>;
  }

  return (
    <span className="rounded border border-dashed border-red-500/60 bg-red-500/10 px-1 py-0.5">
      {entry.devLabel}
      <span className="ml-1.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-red-500">
        Dev · {entry.ssesReference}
      </span>
    </span>
  );
}
