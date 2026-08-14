"use client";

import { useState } from "react";
import type { ProductAddon } from "@/lib/shopify/products";
import { useCart } from "@/components/cart/CartProvider";
import { QuantitySelector } from "./QuantitySelector";

function formatMoney(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

// Fixed checkbox affordance shared by every add-on row (not the per-item
// Shopify metaobject `icon` field, which the legacy theme's own render path
// never actually used) — white outline unchecked, gold-to-flame fill once
// checked.
function FlameCheckbox({ checked }: { checked: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-[22px] w-[22px] shrink-0 transition-colors"
      style={{
        fill: checked ? "#F3500A" : "#ffffff",
        stroke: "#c9a86a",
        strokeWidth: 1.5,
      }}
    >
      <path d="M12 2C10 5 7 7 7 11C7 14.3 9.7 17 13 17C16.3 17 19 14.3 19 11C19 7 16 5 14 2C13 3.5 13 4 12 5C12 4.5 12 3.5 12 2Z" />
    </svg>
  );
}

export function ProductAddonsAndPrice({
  variantId,
  basePrice,
  compareAtPrice,
  currencyCode,
  addons,
  showQuantitySelector,
}: {
  variantId: string | null;
  basePrice: string;
  compareAtPrice: string | null;
  currencyCode: string;
  addons: ProductAddon[];
  showQuantitySelector: boolean;
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState(1);
  const { addItems, isPending } = useCart();

  function toggle(id: string) {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedAddons = addons.filter((addon) => checked.has(addon.id));
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.finalPrice, 0);
  const total = (Number(basePrice) + addonsTotal) * quantity;

  function handleAddToOrder() {
    if (!variantId) return;
    addItems([
      { merchandiseId: variantId, quantity },
      ...selectedAddons.map((addon) => ({
        merchandiseId: addon.variantId,
        quantity,
      })),
    ]);
  }

  return (
    <>
      {addons.length > 0 ? (
        <div className="mt-2">
          <h2 className="font-display text-lg italic text-gold underline decoration-gold/40 underline-offset-4">
            Enhance Your Experience
          </h2>

          <div className="mt-3 flex flex-col gap-3">
            {addons.map((addon) => {
              const isChecked = checked.has(addon.id);
              const discounted = addon.discountPercent > 0;

              return (
                <label
                  key={addon.id}
                  className="flex cursor-pointer items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(addon.id)}
                      className="sr-only"
                    />
                    <FlameCheckbox checked={isChecked} />
                    <span className="text-sm text-cream/90">{addon.label}</span>
                  </span>

                  <span className="text-sm font-medium text-cream whitespace-nowrap">
                    {discounted ? (
                      <>
                        <span className="mr-1.5 text-cream/50 line-through">
                          {formatMoney(Number(addon.basePrice), addon.currencyCode)}
                        </span>
                        {formatMoney(addon.finalPrice, addon.currencyCode)}
                      </>
                    ) : (
                      formatMoney(addon.finalPrice, addon.currencyCode)
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="my-5 h-px w-full bg-gold/30" aria-hidden />

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
          {compareAtPrice !== null && Number(compareAtPrice) > Number(basePrice) ? (
            <p className="text-sm text-cream/50 line-through">
              {formatMoney(Number(compareAtPrice) * quantity, currencyCode)}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleAddToOrder}
          disabled={isPending || !variantId}
          className="gold-cta inline-flex min-h-12 items-center justify-center rounded-full px-8 text-sm font-bold tracking-wide text-gold disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="relative z-[1]">{isPending ? "Adding…" : "Add to Order"}</span>
          <span className="gold-cta__border" aria-hidden />
        </button>
      </div>
    </>
  );
}
