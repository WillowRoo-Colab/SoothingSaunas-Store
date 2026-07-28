import { SsButton } from "./primitives";

// Reusable per blueprint Section 08 — intended for reuse on product and
// collection pages too, not just the homepage.
export function LearningBridgeCard({
  label,
  heading,
  body,
  ctaLabel,
  ctaHref,
  align = "left",
}: {
  label: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`w-full max-w-[680px] rounded-2xl border border-gold bg-cream p-6 text-charcoal shadow-[0_28px_80px_rgba(0,0,0,0.34)] sm:p-10 ${
        align === "right" ? "ml-auto" : ""
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold-600">
        {label}
      </p>
      <h3 className="mt-3 font-heading text-2xl sm:text-3xl">{heading}</h3>
      <p className="mt-3 max-w-[60ch] text-sm text-charcoal/80 sm:text-base">
        {body}
      </p>
      <SsButton href={ctaHref} variant="primary-light" className="mt-6">
        {ctaLabel}
      </SsButton>
    </div>
  );
}
