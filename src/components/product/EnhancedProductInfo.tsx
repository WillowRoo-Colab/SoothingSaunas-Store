import type { ProductDetail, ProductAddon } from "@/lib/shopify/products";
import type { ScrollingTicker as ScrollingTickerData } from "@/lib/scrollingTickers";
import { ScrollingTicker } from "@/components/site/ScrollingTicker";
import { ProductAddonsAndPrice } from "./ProductAddonsAndPrice";

// Duplicated from ProductInfo.tsx rather than modified in place, per the
// "Enhanced Product Template" — keeps the default template's layout
// untouched while this one is styled after the legacy theme's favorite
// product-page layout: banner pinned above everything in the info column,
// and an "Enhance Your Experience" add-ons section (with a live-updating
// total) between the description and the price/buy row.
function Separator() {
  return <div aria-hidden className="my-5 h-px w-full bg-gold/30" />;
}

export function EnhancedProductInfo({
  product,
  addons,
  ticker,
}: {
  product: ProductDetail;
  addons: ProductAddon[];
  ticker: ScrollingTickerData | null;
}) {
  return (
    <div className="text-cream">
      {ticker ? (
        <div className="mb-5">
          <ScrollingTicker ticker={ticker} />
        </div>
      ) : null}

      {/* Lighter-toned card than the page's base charcoal — title, collection,
          and vendor step down in size and indent further right each row,
          same font family each already used before this reorder. */}
      <div className="rounded-2xl border border-gold/20 bg-charcoal-900 p-6 sm:p-8">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">
          {product.title}
        </h1>

        {product.collectionTitle ? (
          <p className="ml-4 mt-2 font-display text-lg italic text-gold">
            from the {product.collectionTitle}
          </p>
        ) : null}

        {product.vendor ? (
          <p className="ml-8 mt-2 text-sm text-cream/70">
            by{" "}
            <span className="font-medium text-cream">{product.vendor}</span>
          </p>
        ) : null}

        <Separator />

        {product.descriptionHtml ? (
          <div
            className="text-[15px] leading-relaxed text-cream/90 [&_p]:mb-4 [&_p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        ) : null}

        {product.capacity ? (
          <p className="mt-4 text-sm text-cream/90">
            <span className="font-semibold text-cream">Seating Capacity</span>:
            up to <span className="font-semibold text-cream">{product.capacity}</span>{" "}
            people
          </p>
        ) : null}

        {product.heatStyle ? (
          <p className="mt-2 text-sm text-cream/90">
            <span className="font-semibold text-cream">Heating Style</span>:{" "}
            {product.heatStyle}
          </p>
        ) : null}

        {product.specSheetUrl ? (
          <a
            href={product.specSheetUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-medium text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
          >
            View Product Specifications
          </a>
        ) : null}

        {product.heaterOptions.length > 0 ? (
          <div className="mt-4 text-sm text-cream/90">
            <p className="font-semibold text-cream">Available Heater Options</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              {product.heaterOptions.map((option) => (
                <li key={option}>{option}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <Separator />

        <ProductAddonsAndPrice
          basePrice={product.price}
          compareAtPrice={product.compareAtPrice}
          currencyCode={product.currencyCode}
          addons={addons}
        />
      </div>
    </div>
  );
}
