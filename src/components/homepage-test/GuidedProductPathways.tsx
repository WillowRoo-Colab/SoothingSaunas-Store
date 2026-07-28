import Image from "next/image";
import Link from "next/link";
import { SectionShell } from "./primitives";

export interface PathwayCard {
  label: string;
  descriptor: string;
  href: string;
  imageUrl: string | null;
}

export function GuidedProductPathways({ cards }: { cards: PathwayCard[] }) {
  return (
    <SectionShell
      tone="charcoal"
      title="Choose where your reset begins."
      className="pt-0 sm:pt-0"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl border border-transparent transition-colors hover:border-gold lg:aspect-[4/5]"
          >
            {card.imageUrl ? (
              <Image
                src={card.imageUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.035]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-charcoal-800">
                <span className="font-heading text-lg text-gold">
                  {card.label}
                </span>
              </div>
            )}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent"
            />
            <div className="relative p-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold">
                {card.label}
              </p>
              <p className="mt-1 text-lg text-[#f7f1e5]">{card.descriptor}</p>
              <span
                aria-hidden
                className="mt-2 inline-block text-gold transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}
