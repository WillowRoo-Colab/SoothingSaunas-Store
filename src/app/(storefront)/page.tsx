import Image from "next/image";
import { getCollections } from "@/lib/shopify/collections";
import { featuredCollectionHandles } from "@/lib/navigation";
import { CollectionCard } from "@/components/commerce/CollectionCard";
import { getActiveImage } from "@/lib/images";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HEADER_MAX } from "@/components/layout/ShrinkingHeader";
import { DevPlaceholder } from "@/components/dev/DevPlaceholder";
import { devContent } from "@/lib/dev-content";

export default async function Home() {
  const [collections, heroImage] = await Promise.all([
    getCollections(),
    getActiveImage("homepage-hero"),
  ]);

  const featured = featuredCollectionHandles
    .map((handle) => collections.find((c) => c.handle === handle))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <main id="main-content" className="flex flex-1 flex-col bg-charcoal">
      {/* TODO(owner): replace with approved hero copy per SSES-009 —
          this placeholder makes no product or health claims. Hero image is
          managed at /store-settings, not in code. Dark-dominant per
          SSES-007 4.2 / SSES-003 First Impression Standard. Reserves space
          for the header's resting height so the hero image starts fresh
          below it rather than being hidden underneath (see
          ShrinkingHeader). */}
      <div aria-hidden style={{ height: HEADER_MAX }} />
      <section className="relative mx-auto flex min-h-[80vh] w-full max-w-[1600px] items-center justify-center overflow-hidden px-4 text-center text-cream sm:px-8">
        {heroImage ? (
          <>
            <Image
              src={heroImage.publicUrl}
              alt=""
              fill
              priority
              sizes="(min-width: 1600px) 1600px, 100vw"
              className="object-cover"
              style={{
                objectPosition: `${heroImage.focalX}% ${heroImage.focalY}%`,
              }}
            />
            {/* Scrim: darker toward the edges for text legibility, without
                flattening the image the way a uniform opacity overlay does. */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/20" />
          </>
        ) : null}
        {/* TODO(owner): SSES-010/011 require one real H1 per page; kept
            accessible but visually hidden until hero copy is approved. */}
        <h1 className="sr-only">Soothing Saunas</h1>
      </section>

      <div aria-hidden className="mx-auto h-px w-24 bg-gold/40" />

      <section className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-8">
        <ScrollReveal variant="pop">
          {/* "Learn more" intentionally not a live link yet — no Learn hub
              exists to point it at. Wire to /learn once that section is
              built. Copy pending: see src/lib/dev-content.ts. */}
          <div className="rounded-xl border-t-2 border-gold bg-charcoal/60 p-8 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] sm:p-12">
            <p className="font-display text-sm uppercase tracking-[0.2em] text-gold">
              Beyond the storefront
            </p>
            <h2 className="mt-3 font-display text-3xl text-cream">
              An education-first approach to wellness
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-silver">
              <DevPlaceholder entry={devContent.teaserBody} />
            </p>
            <span className="mt-6 inline-block text-sm font-medium text-gold underline decoration-gold/40 underline-offset-4">
              <DevPlaceholder entry={devContent.teaserLink} />
            </span>
          </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-8">
        <ScrollReveal variant="fade">
          <h2 className="font-display text-2xl text-cream">
            Shop by Category
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {featured.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
