import Image from "next/image";
import type { StorefrontProduct } from "@/lib/shopify/products";
import { Eyebrow, SsButton } from "./primitives";

function formatPrice(product: StorefrontProduct) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(product.price));
}

export function FeaturedExperience({
  product,
  // Content gap: this product's own Shopify image is a technical rendering,
  // not lifestyle photography, so a stand-in image is used for tone here.
  // Swap for the product's real photo once better imagery exists.
  imageUrl,
}: {
  product: StorefrontProduct | null;
  imageUrl?: string | null;
}) {
  if (!product) return null;
  const displayImage = imageUrl ?? product.imageUrl;

  return (
    <section className="bg-charcoal py-18 text-[#f7f1e5] sm:py-24">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-8 lg:grid-cols-[55%_45%] lg:items-center lg:gap-16">
        <div className="relative order-1">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
            {displayImage ? (
              <Image
                src={displayImage}
                alt={product.imageAlt ?? product.title}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>

          {/* Floating product-detail card, not a full tile. */}
          <div className="absolute -bottom-6 left-6 rounded-xl border border-gold bg-cream px-5 py-4 text-charcoal shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] sm:left-8">
            <p className="text-xs uppercase tracking-[0.1em] text-charcoal/60">
              Starting at
            </p>
            <p className="font-heading text-xl">{formatPrice(product)}</p>
          </div>
        </div>

        <div className="order-2">
          <Eyebrow>Featured experience</Eyebrow>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl">
            A quieter kind of luxury.
          </h2>
          <p className="mt-4 max-w-[55ch] text-base opacity-90">
            Built for homes where restoration deserves its own room. Natural
            materials, enveloping heat, and enough space to make slowing down
            feel intentional.
          </p>
          <ul className="mt-5 space-y-2 text-sm opacity-90">
            <li>Designed for 2–3 guests</li>
            <li>Indoor installation</li>
            <li>Choice of heating system</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <SsButton
              href={`/products/${product.handle}`}
              variant="primary-dark"
            >
              View the {product.title}
            </SsButton>
            <SsButton
              href="/buying-guide"
              variant="outline-dark"
            >
              See what to know before buying
            </SsButton>
          </div>
        </div>
      </div>
    </section>
  );
}
