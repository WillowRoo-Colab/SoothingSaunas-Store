import Image from "next/image";
import Link from "next/link";
import type { StorefrontProduct } from "@/lib/shopify/products";

function formatPrice(product: StorefrontProduct) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(product.price));
}

export function ProductGridCard({
  product,
  layout = "grid",
}: {
  product: StorefrontProduct;
  layout?: "grid" | "list";
}) {
  // Card fill is a couple shades lighter than the page's charcoal (#151515)
  // background — reads as a soft, distinct panel rather than a stark black
  // block. Solid gold border (no glow/shadow) brightens on hover; the image
  // itself supplies the hover feedback via a slight zoom (below).
  const CARD_CLASS =
    "rounded-lg border border-gold/30 bg-charcoal-900 transition-colors duration-300 hover:border-gold/70";

  if (layout === "list") {
    return (
      <Link
        href={`/products/${product.handle}`}
        className={`group flex items-center gap-4 p-4 ${CARD_CLASS}`}
      >
        <div className="relative aspect-4/3 w-32 shrink-0 overflow-hidden rounded-[14px] bg-[#1a1a1a] shadow-[0_0_20px_rgba(201,168,106,0.1)]">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.imageAlt ?? product.title}
              fill
              sizes="128px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.15]"
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-1">
          <span className="line-clamp-2 min-h-[3.5rem] font-display text-xl text-cream">
            {product.title}
          </span>
          <span className="text-sm text-gold">{formatPrice(product)}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/products/${product.handle}`}
      className={`group flex flex-col p-5 ${CARD_CLASS}`}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-[14px] bg-[#1a1a1a] shadow-[0_0_20px_rgba(201,168,106,0.1)]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.imageAlt ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.15]"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-1 pt-3">
        <span className="line-clamp-2 min-h-[3.5rem] font-display text-lg text-cream">
          {product.title}
        </span>
        <span className="text-sm text-gold">{formatPrice(product)}</span>
      </div>
    </Link>
  );
}
