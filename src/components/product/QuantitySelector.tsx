"use client";

export function QuantitySelector({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        aria-label="Decrease quantity"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold transition hover:border-gold"
      >
        &minus;
      </button>
      <span className="w-6 text-center text-sm text-cream">{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label="Increase quantity"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold transition hover:border-gold"
      >
        &#43;
      </button>
    </div>
  );
}
