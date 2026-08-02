import Image from "next/image";
import { getFeaturedProductHandle, HOMEPAGE_FEATURED_SLOT } from "@/lib/featuredProducts";
import { listAllProducts, getProductByHandle } from "@/lib/shopify/products";
import { setFeaturedProductAction } from "./actions";

// Admin settings pages must always reflect the latest saved state — this
// page has no session-bound (cookies()/headers()) reads of its own to make
// Next.js infer that automatically, so it would otherwise get statically
// optimized and served from a stale ISR snapshot after Save.
export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  const [products, currentHandle] = await Promise.all([
    listAllProducts(),
    getFeaturedProductHandle(HOMEPAGE_FEATURED_SLOT),
  ]);

  const currentProduct = currentHandle ? await getProductByHandle(currentHandle) : null;
  const isStale = Boolean(currentHandle) && !currentProduct;

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Promotions</h1>

      <section className="mt-8 max-w-lg">
        <h2 className="text-lg font-medium">Homepage Featured Experience</h2>
        <p className="mt-1 text-sm text-charcoal/70">
          Choose which product from your live Shopify inventory appears in
          the homepage&apos;s &quot;Featured experience&quot; section.
        </p>

        {isStale ? (
          <p className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            The currently saved product (&quot;{currentHandle}&quot;) no longer exists
            in Shopify, so this section is hidden on the homepage. Pick a
            replacement below.
          </p>
        ) : null}

        {currentProduct ? (
          <div className="mt-4 flex items-center gap-3 rounded border border-silver p-3">
            {currentProduct.imageUrl ? (
              <Image
                src={currentProduct.imageUrl}
                alt={currentProduct.imageAlt ?? currentProduct.title}
                width={56}
                height={56}
                className="h-14 w-14 rounded object-cover"
              />
            ) : null}
            <div>
              <p className="text-xs uppercase tracking-wide text-charcoal/50">
                Currently featured
              </p>
              <p className="font-medium text-charcoal">{currentProduct.title}</p>
            </div>
          </div>
        ) : null}

        <form action={setFeaturedProductAction} className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="productHandle" className="text-sm font-medium">
              Product
            </label>
            <select
              key={currentHandle ?? "none"}
              id="productHandle"
              name="productHandle"
              defaultValue={currentHandle ?? ""}
              required
              className="rounded border border-silver px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Select a product…
              </option>
              {products.map((product) => (
                <option key={product.handle} value={product.handle}>
                  {product.title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="self-start rounded bg-charcoal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
          >
            Save
          </button>
        </form>
      </section>
    </div>
  );
}
