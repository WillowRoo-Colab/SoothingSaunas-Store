import { notFound } from "next/navigation";
import { getProductDetailByHandle } from "@/lib/shopify/products";
import { getTickerByPlacement } from "@/lib/scrollingTickers";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const [product, ticker] = await Promise.all([
    getProductDetailByHandle(handle),
    getTickerByPlacement("product-page-sidebar"),
  ]);

  if (!product) notFound();

  return (
    <main id="main-content" className="bg-charcoal py-12 sm:py-16">
      <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-4 sm:px-8 lg:grid-cols-[65fr_35fr] lg:gap-8">
        <ProductGallery media={product.media} productTitle={product.title} />
        <ProductInfo product={product} ticker={ticker} />
      </div>
    </main>
  );
}
