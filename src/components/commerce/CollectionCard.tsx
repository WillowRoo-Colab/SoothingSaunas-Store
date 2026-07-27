import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/shopify/collections";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/collections/${collection.handle}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-silver"
    >
      <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden bg-charcoal">
        {collection.imageUrl ? (
          <Image
            src={collection.imageUrl}
            alt={collection.imageAlt ?? collection.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="font-display text-2xl text-gold">
            {collection.title}
          </span>
        )}
      </div>
      <span className="px-4 py-3 text-sm font-medium text-charcoal">
        {collection.title}
      </span>
    </Link>
  );
}
