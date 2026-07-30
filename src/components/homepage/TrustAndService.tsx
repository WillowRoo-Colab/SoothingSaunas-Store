import { SectionShell } from "./primitives";

const TRUST_ITEMS = [
  {
    label: "Real guidance",
    body: "Talk through space, heat type, installation, and use before choosing.",
  },
  {
    label: "Clear product information",
    body: "Specifications and requirements presented in plain language.",
  },
  {
    label: "Support after purchase",
    body: "A direct customer-service line when you need help.",
  },
  {
    label: "Secure Shopify checkout",
    body: "Commerce, payment, tax, and order processing remain within Shopify.",
  },
] as const;

export function TrustAndService() {
  return (
    <SectionShell
      tone="cream"
      title="A major purchase should never feel like a blind one."
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_ITEMS.map((item) => (
          <div key={item.label}>
            <p className="font-heading text-lg">{item.label}</p>
            <p className="mt-2 text-sm text-charcoal/75">{item.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-12 border-t border-charcoal/15 pt-6 text-sm text-charcoal/80">
        Questions? Call{" "}
        <a href="tel:+15042859552" className="underline decoration-gold-600">
          (504) 285-9552
        </a>{" "}
        or email{" "}
        <a
          href="mailto:support@soothingsaunas.com"
          className="underline decoration-gold-600"
        >
          support@soothingsaunas.com
        </a>
        .
      </p>
    </SectionShell>
  );
}
