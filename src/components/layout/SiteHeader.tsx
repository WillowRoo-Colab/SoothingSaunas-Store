import Image from "next/image";
import Link from "next/link";
import { getShop } from "@/lib/shopify/shop";
import { primaryNav, collectionHref } from "@/lib/navigation";

export async function SiteHeader() {
  const shop = await getShop();

  return (
    <header className="bg-charcoal text-cream">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Home">
          {shop.logoUrl ? (
            <Image
              src={shop.logoUrl}
              alt={shop.logoAlt ?? shop.name}
              width={160}
              height={40}
              priority
              className="h-10 w-auto"
            />
          ) : (
            <span className="font-display text-xl text-gold">
              {shop.name}
            </span>
          )}
        </Link>

        <nav aria-label="Primary">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
            {primaryNav.map((item) => (
              <li key={item.handle}>
                <Link
                  href={collectionHref(item.handle)}
                  className="transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
