import type { ProductDetail } from "@/lib/shopify/products";
import type { ScrollingTicker as ScrollingTickerData } from "@/lib/scrollingTickers";
import { ScrollingTicker } from "@/components/site/ScrollingTicker";
import { ProductBuyRow } from "./ProductBuyRow";

function Separator() {
  return <div aria-hidden className="my-5 h-px w-full bg-gold/30" />;
}

export function ProductInfo({
  product,
  ticker,
}: {
  product: ProductDetail;
  ticker: ScrollingTickerData | null;
}) {
  return (
    <div className="text-cream">
      {product.vendor ? (
        <p className="text-sm text-cream/70">
          by{" "}
          <span className="font-medium text-cream">{product.vendor}</span>
        </p>
      ) : null}

      <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
        {product.title}
      </h1>

      {product.collectionTitle ? (
        <p className="mt-1 font-display text-lg italic text-gold">
          from the {product.collectionTitle}
        </p>
      ) : null}

      <Separator />

      {ticker ? (
        <div className="mb-5">
          <ScrollingTicker ticker={ticker} />
        </div>
      ) : null}

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

      <ProductBuyRow
        variantId={product.firstVariantId}
        price={product.price}
        compareAtPrice={product.compareAtPrice}
        currencyCode={product.currencyCode}
        showQuantitySelector={product.showQuantitySelector}
      />
    </div>
  );
}
