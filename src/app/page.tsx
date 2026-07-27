import Image from "next/image";
import { getCollections } from "@/lib/shopify/collections";
import { primaryNav } from "@/lib/navigation";
import { CollectionCard } from "@/components/commerce/CollectionCard";
import { getActiveImage } from "@/lib/images";

export default async function Home() {
  const [collections, heroImage] = await Promise.all([
    getCollections(),
    getActiveImage("homepage-hero"),
  ]);

  const featured = primaryNav
    .map((nav) => collections.find((c) => c.handle === nav.handle))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      {/* TODO(owner): replace with approved hero copy per SSES-009 —
          this placeholder makes no product or health claims. Hero image is
          managed at /store-settings, not in code. */}
      <section className="relative overflow-hidden bg-charcoal px-4 py-20 text-center text-cream sm:px-8">
        {heroImage ? (
          <Image
            src={heroImage.publicUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
        ) : null}
        <div className="relative">
          <h1 className="font-display text-4xl sm:text-5xl">
            Soothing Saunas
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-silver">
            Hero copy pending — hand-off needed from SSES-009 content review.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8">
        <h2 className="font-display text-2xl text-charcoal">
          Shop by Category
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {featured.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>
    </main>
  );
}
