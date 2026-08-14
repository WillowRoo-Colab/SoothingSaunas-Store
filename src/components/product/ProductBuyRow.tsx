"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { QuantitySelector } from "./QuantitySelector";

function formatMoney(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

// Default template's price + buy button — split out from ProductInfo (a
// Server Component) since adding to cart needs client state (quantity,
// CartProvider). Deliberately keeps its own plain gold-outline button
// styling rather than the Enhanced template's gold-cta shimmer treatment
// (ProductAddonsAndPrice) — that's a look requested for that template only.
export function ProductBuyRow({
  variantId,
  price,
  compareAtPrice,
  currencyCode,
  showQuantitySelector,
}: {
  variantId: string | null;
  price: string;
  compareAtPrice: string | null;
  currencyCode: string;
  showQuantitySelector: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const { addItems, isPending } = useCart();

  const hasCompareAt =
    compareAtPrice !== null && Number(compareAtPrice) > Number(price);
  const total = Number(price) * quantity;

  function handleAddToOrder() {
    if (!variantId) return;
    addItems([{ merchandiseId: variantId, quantity }]);
  }

  return (
    <>
      {showQuantitySelector ? (
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-cream/70">Quantity</span>
          <QuantitySelector quantity={quantity} onChange={setQuantity} />
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-xl font-semibold text-cream sm:text-2xl">
            {formatMoney(total, currencyCode)}
          </p>
          {hasCompareAt ? (
            <p className="text-sm text-cream/50 line-through">
              {formatMoney(Number(compareAtPrice) * quantity, currencyCode)}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleAddToOrder}
          disabled={isPending || !variantId}
          className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-gold px-8 text-sm font-bold tracking-wide text-gold transition-colors hover:bg-gold hover:text-charcoal disabled:cursor-not-allowed disabled:border-gold/50 disabled:text-gold/50 disabled:hover:bg-transparent disabled:hover:text-gold/50"
        >
          {isPending ? "Adding…" : "Add to Order"}
        </button>
      </div>
    </>
  );
}
