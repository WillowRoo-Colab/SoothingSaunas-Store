import { getShop } from "@/lib/shopify/shop";

// Temporary connectivity check for the Shopify Storefront API data layer.
// Not the real homepage — SSES-007/008/009-compliant homepage design is
// separate future work.
export default async function Home() {
  const shop = await getShop();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-16">
      <p className="text-sm uppercase tracking-wide text-zinc-500">
        Shopify Storefront API connected
      </p>
      <h1 className="text-2xl font-semibold">{shop.name}</h1>
      <p className="text-zinc-500">{shop.primaryDomain.url}</p>
    </main>
  );
}
