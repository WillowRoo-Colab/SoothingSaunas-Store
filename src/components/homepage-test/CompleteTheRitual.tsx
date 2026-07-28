import Image from "next/image";
import type { StorefrontProduct } from "@/lib/shopify/products";
import { SectionShell } from "./primitives";

function formatPrice(product: StorefrontProduct) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(product.price));
}

export function CompleteTheRitual({
  products,
}: {
  products: StorefrontProduct[];
}) {
  return (
    <SectionShell tone="charcoal" title="The room matters. So does the ritual.">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col gap-3">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f3ead6]">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.imageAlt ?? product.title}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-contain p-4"
                />
              ) : null}
            </div>
            <p className="line-clamp-2 text-sm font-medium text-[#f7f1e5]">
              {product.title}
            </p>
            <p className="text-sm text-[#c9c3b8]">{formatPrice(product)}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
