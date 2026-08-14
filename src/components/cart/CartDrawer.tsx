"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

export function CartDrawer() {
  const { cart, isOpen, isPending, error, closeCart, updateQuantity, removeItem } =
    useCart();

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const lines = cart?.lines ?? [];

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="flex h-full w-full max-w-md flex-col bg-charcoal text-cream shadow-[0_0_60px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center justify-between border-b border-gold/20 px-6 py-5">
          <h2 className="font-display text-xl font-semibold">Your Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-gold text-xl text-gold transition hover:scale-105 hover:opacity-85"
          >
            &times;
          </button>
        </div>

        {error ? (
          <p role="alert" className="mx-6 mt-4 rounded border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-cream/70">Your cart is empty.</p>
            <Link
              href="/collections/all-products"
              onClick={closeCart}
              className="text-sm font-medium text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
            >
              Continue browsing
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="flex flex-col gap-5">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[10px] bg-charcoal-900">
                    {line.imageUrl ? (
                      <Image
                        src={line.imageUrl}
                        alt={line.imageAlt ?? line.productTitle}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${line.productHandle}`}
                        onClick={closeCart}
                        className="text-sm font-medium text-cream hover:text-gold"
                      >
                        {line.productTitle}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(line.id)}
                        disabled={isPending}
                        aria-label={`Remove ${line.productTitle} from cart`}
                        className="text-cream/50 transition hover:text-gold disabled:opacity-50"
                      >
                        &times;
                      </button>
                    </div>

                    {line.variantTitle ? (
                      <p className="text-xs text-cream/50">{line.variantTitle}</p>
                    ) : null}

                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          disabled={isPending}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 text-gold transition hover:border-gold disabled:opacity-50"
                        >
                          &minus;
                        </button>
                        <span className="w-5 text-center text-sm">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          disabled={isPending}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 text-gold transition hover:border-gold disabled:opacity-50"
                        >
                          &#43;
                        </button>
                      </div>
                      <span className="text-sm font-medium">
                        {formatMoney(line.lineTotal, line.currencyCode)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {lines.length > 0 && cart ? (
          <div className="border-t border-gold/20 px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-cream/70">Subtotal</span>
              <span className="font-display text-lg font-semibold">
                {formatMoney(cart.subtotal, cart.currencyCode)}
              </span>
            </div>
            <a
              href={cart.checkoutUrl}
              className="gold-cta flex min-h-12 w-full items-center justify-center rounded-full px-8 text-sm font-bold tracking-wide text-gold"
            >
              <span className="relative z-[1]">Checkout</span>
              <span className="gold-cta__border" aria-hidden />
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
