import type { StorefrontProduct } from "@/lib/shopify/products";
import { SectionShell } from "./primitives";
import { CommerceBridgeCard } from "./CommerceBridgeCard";

const ARTICLES = [
  {
    category: "Buying Guide",
    readingTime: "8 min read",
    title: "Infrared vs. traditional vs. steam: how to actually choose",
    summary:
      "A plain-language walkthrough of how each heat type feels, what it needs, and who tends to prefer it.",
    lead: true,
  },
  {
    category: "Wellness Education",
    readingTime: "5 min read",
    title: "What heat exposure does — and doesn't — do for recovery",
    summary:
      "What the research actually supports, and where the evidence is still limited.",
    lead: false,
  },
  {
    category: "Ownership Guide",
    readingTime: "6 min read",
    title: "Keeping your sauna running well for years, not just months",
    summary: "Maintenance basics that protect the investment you made.",
    lead: false,
  },
] as const;

export function JournalFeature({
  bridgeProduct,
}: {
  bridgeProduct: StorefrontProduct | null;
}) {
  const [lead, ...rest] = ARTICLES;

  return (
    <SectionShell
      tone="cream"
      title="Learn before you decide."
      description="Practical guidance, product comparisons, and evidence-aware wellness education."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <article className="sm:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-gold-600">
              {lead.category} · {lead.readingTime}
            </p>
            <h3 className="mt-2 font-heading text-2xl">{lead.title}</h3>
            <p className="mt-2 max-w-[65ch] text-sm text-charcoal/75">
              {lead.summary}
            </p>
          </article>

          {rest.map((article) => (
            <article key={article.title}>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-gold-600">
                {article.category} · {article.readingTime}
              </p>
              <h3 className="mt-2 font-heading text-lg">{article.title}</h3>
              <p className="mt-2 text-sm text-charcoal/75">
                {article.summary}
              </p>
            </article>
          ))}
        </div>

        {bridgeProduct ? (
          <div className="flex justify-center lg:justify-end">
            <CommerceBridgeCard product={bridgeProduct} />
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
