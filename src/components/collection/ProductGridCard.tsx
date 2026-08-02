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
  if (layout === "list") {
    return (
      <Link
        href={`/products/${product.handle}`}
        className="group flex items-center gap-4 overflow-hidden rounded-lg border border-gold/20 bg-charcoal p-3 transition-colors duration-300 hover:border-gold/60"
      >
        <div className="relative aspect-4/3 w-32 shrink-0 overflow-hidden rounded bg-charcoal-900">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.imageAlt ?? product.title}
              fill
              sizes="128px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-display text-base text-cream">{product.title}</span>
          <span className="text-sm text-gold">{formatPrice(product)}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gold/20 bg-charcoal transition-colors duration-300 hover:border-gold/60"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-charcoal-900">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.imageAlt ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-1 px-4 py-3">
        <span className="font-display text-base text-cream">{product.title}</span>
        <span className="text-sm text-gold">{formatPrice(product)}</span>
      </div>
    </Link>
  );
}
