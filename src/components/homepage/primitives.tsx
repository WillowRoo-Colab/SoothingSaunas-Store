import Link from "next/link";

export type SectionTone = "charcoal" | "cream" | "tonal-dark";

const TONE_CLASSES: Record<SectionTone, string> = {
  charcoal: "bg-charcoal text-[#f7f1e5]",
  "tonal-dark": "bg-charcoal-900 text-[#f7f1e5]",
  cream: "bg-cream text-charcoal",
};

export function SectionShell({
  id,
  tone = "charcoal",
  eyebrow,
  title,
  description,
  className,
  headerClassName,
  children,
}: {
  id?: string;
  tone?: SectionTone;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={`relative overflow-clip py-18 sm:py-24 ${TONE_CLASSES[tone]} ${className ?? ""}`}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8">
        {(eyebrow || title || description) && (
          <header className={`mb-10 max-w-2xl ${headerClassName ?? ""}`}>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {title ? (
              <h2 className="mt-3 font-heading text-3xl sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-3 max-w-[65ch] text-base opacity-90">
                {description}
              </p>
            ) : null}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-xs font-bold uppercase tracking-[0.15em] text-gold ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

type ButtonVariant =
  | "primary-dark"
  | "outline-dark"
  | "primary-light"
  | "outline-light";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  "primary-dark": "bg-cream text-charcoal hover:border-gold border border-transparent",
  "outline-dark": "bg-transparent text-[#f7f1e5] border border-gold",
  "primary-light": "bg-charcoal text-cream border border-transparent",
  "outline-light": "bg-transparent text-charcoal border border-charcoal/40",
};

export function SsButton({
  href,
  variant = "primary-dark",
  children,
  className,
}: {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold tracking-wide transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-gold-400 ${BUTTON_VARIANTS[variant]} ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}
