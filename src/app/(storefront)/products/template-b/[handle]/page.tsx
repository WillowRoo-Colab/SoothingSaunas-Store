import { notFound } from "next/navigation";
import { getProductDetailByHandle, getProductAddons } from "@/lib/shopify/products";
import { getTickerByPlacement } from "@/lib/scrollingTickers";
import { ProductGallery } from "@/components/product/ProductGallery";
import { EnhancedProductInfo } from "@/components/product/EnhancedProductInfo";

// Enhanced Product Template — duplicated from products/[handle]/page.tsx
// rather than edited in place, so the default template stays untouched.
// Shares ProductGallery (no styling changes needed there — the gallery and
// zoom modal already match this layout) but uses EnhancedProductInfo, which
// pins the scrolling banner to the top of the info column and adds the
// "Enhance Your Experience" add-ons section below the description.
export default async function EnhancedProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const [product, addons, ticker] = await Promise.all([
    getProductDetailByHandle(handle),
    getProductAddons(handle),
    getTickerByPlacement("product-page-sidebar"),
  ]);

  if (!product) notFound();

  return (
    <main id="main-content" className="bg-charcoal py-12 sm:py-16">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 sm:px-8 lg:grid-cols-[65fr_35fr] lg:gap-8">
        <ProductGallery media={product.media} productTitle={product.title} />
        <EnhancedProductInfo product={product} addons={addons} ticker={ticker} />
      </div>
    </main>
  );
}
