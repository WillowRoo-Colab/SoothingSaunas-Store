import "server-only";
import { shopifyFetch } from "./client";
import {
  PRODUCT_BY_HANDLE_QUERY,
  type ProductByHandleQueryData,
} from "./queries/products";

export interface StorefrontProduct {
  id: string;
  title: string;
  handle: string;
  imageUrl: string | null;
  imageAlt: string | null;
  price: string;
  currencyCode: string;
}

export async function getProductByHandle(
  handle: string
): Promise<StorefrontProduct | null> {
  const data = await shopifyFetch<ProductByHandleQueryData>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    next: { revalidate: 3600 },
  });

  if (!data.product) return null;

  return {
    id: data.product.id,
    title: data.product.title,
    handle: data.product.handle,
    imageUrl: data.product.featuredImage?.url ?? null,
    imageAlt: data.product.featuredImage?.altText ?? null,
    price: data.product.priceRange.minVariantPrice.amount,
    currencyCode: data.product.priceRange.minVariantPrice.currencyCode,
  };
}

export async function getProductsByHandles(
  handles: string[]
): Promise<StorefrontProduct[]> {
  const results = await Promise.all(handles.map(getProductByHandle));
  return results.filter((p): p is StorefrontProduct => p !== null);
}
