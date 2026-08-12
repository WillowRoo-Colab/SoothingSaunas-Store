"use client";

import { useState } from "react";
import type { StorefrontProduct } from "@/lib/shopify/products";
import { ProductGridCard } from "./ProductGridCard";

export function CollectionProductGrid({ products }: { products: StorefrontProduct[] }) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  return (
    <div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setLayout("list")}
          aria-label="List view"
          aria-pressed={layout === "list"}
          className={`flex h-9 w-9 items-center justify-center rounded border transition-colors ${
            layout === "list"
              ? "border-gold text-gold"
              : "border-gold/30 text-cream/60 hover:text-gold"
          }`}
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M3 5h14M3 10h14M3 15h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setLayout("grid")}
          aria-label="Grid view"
          aria-pressed={layout === "grid"}
          className={`flex h-9 w-9 items-center justify-center rounded border transition-colors ${
            layout === "grid"
              ? "border-gold text-gold"
              : "border-gold/30 text-cream/60 hover:text-gold"
          }`}
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
            <rect x="3" y="3" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="11" y="3" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="3" y="11" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="11" y="11" width="6" height="6" rx="1" fill="currentColor" />
          </svg>
        </button>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-center text-sm text-cream/60">
          No products in this collection yet.
        </p>
      ) : layout === "grid" ? (
        <div className="mt-4 grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <ProductGridCard key={product.id} product={product} layout="grid" />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {products.map((product) => (
            <ProductGridCard key={product.id} product={product} layout="list" />
          ))}
        </div>
      )}
    </div>
  );
}
