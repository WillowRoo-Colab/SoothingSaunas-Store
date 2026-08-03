import { notFound } from "next/navigation";
import {
  getCollectionProducts,
  type CollectionProductsSortKey,
} from "@/lib/shopify/collections";
import { getTickerByPlacement } from "@/lib/scrollingTickers";
import { CollectionSortSelect } from "@/components/collection/CollectionSortSelect";
import { CollectionProductGrid } from "@/components/collection/CollectionProductGrid";
import { ScrollingTicker } from "@/components/site/ScrollingTicker";

const SORT_MAP: Record<string, { sortKey: CollectionProductsSortKey; reverse: boolean }> = {
  featured: { sortKey: "COLLECTION_DEFAULT", reverse: false },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  "best-selling": { sortKey: "BEST_SELLING", reverse: false },
  newest: { sortKey: "CREATED", reverse: true },
  "alphabetical-az": { sortKey: "TITLE", reverse: false },
  "alphabetical-za": { sortKey: "TITLE", reverse: true },
};

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { handle } = await params;
  const { sort = "featured" } = await searchParams;
  const { sortKey, reverse } = SORT_MAP[sort] ?? SORT_MAP.featured;

  const [result, ticker] = await Promise.all([
    getCollectionProducts(handle, { sortKey, reverse }),
    getTickerByPlacement("collection-above-grid"),
  ]);
  if (!result) notFound();

  return (
    <main id="main-content" className="bg-charcoal py-12 sm:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <h1 className="font-display text-3xl text-cream sm:text-4xl">{result.title}</h1>

        <div className="mt-6 flex items-center justify-between border-b border-gold/20 pb-4">
          <p className="text-sm text-cream/60">
            {result.products.length}{" "}
            {result.products.length === 1 ? "product" : "products"}
          </p>
          <CollectionSortSelect currentSort={sort} />
        </div>

        {ticker ? (
          <div className="mt-6">
            <ScrollingTicker ticker={ticker} />
          </div>
        ) : null}

        <div className="mt-2">
          <CollectionProductGrid products={result.products} />
        </div>
      </div>
    </main>
  );
}
