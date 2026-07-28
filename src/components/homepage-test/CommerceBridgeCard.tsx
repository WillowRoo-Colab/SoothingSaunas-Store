import Image from "next/image";
import type { StorefrontProduct } from "@/lib/shopify/products";
import { SsButton } from "./primitives";

// Reusable per blueprint Section 11 — a product feature card for use inside
// cream (learning) content.
export function CommerceBridgeCard({
  product,
}: {
  product: StorefrontProduct;
}) {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(product.price));

  return (
    <div className="flex max-w-sm flex-col gap-4 rounded-2xl border border-gold bg-charcoal p-6 text-[#f7f1e5] shadow-[0_28px_80px_rgba(0,0,0,0.34)]">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold">
        Mentioned in this guide
      </p>
      {product.imageUrl ? (
        <div className="relative aspect-4/3 overflow-hidden rounded-lg">
          <Image
            src={product.imageUrl}
            alt={product.imageAlt ?? product.title}
            fill
            sizes="384px"
            className="object-cover"
          />
        </div>
      ) : null}
      <p className="font-heading text-lg">{product.title}</p>
      <p className="text-sm opacity-80">{price}</p>
      <SsButton href={`/products/${product.handle}`} variant="outline-dark">
        View product
      </SsButton>
    </div>
  );
}
