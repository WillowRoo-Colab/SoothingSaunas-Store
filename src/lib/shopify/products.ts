import "server-only";
import { shopifyFetch } from "./client";
import {
  PRODUCT_BY_HANDLE_QUERY,
  type ProductByHandleQueryData,
  PRODUCT_DETAIL_BY_HANDLE_QUERY,
  type ProductDetailQueryData,
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

export interface ProductDetailMedia {
  id: string;
  url: string;
  alt: string | null;
}

export interface ProductDetail {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  descriptionHtml: string;
  price: string;
  compareAtPrice: string | null;
  currencyCode: string;
  collectionTitle: string | null;
  media: ProductDetailMedia[];
  firstVariantId: string | null;
  capacity: string | null;
  heatStyle: string | null;
  specSheetUrl: string | null;
  heaterOptions: string[];
}

type ProductDetailData = NonNullable<ProductDetailQueryData["product"]>;

function findMetafield(metafields: ProductDetailData["metafields"], key: string) {
  return metafields.find((m) => m?.key === key) ?? null;
}

export async function getProductDetailByHandle(
  handle: string
): Promise<ProductDetail | null> {
  const data = await shopifyFetch<ProductDetailQueryData>({
    query: PRODUCT_DETAIL_BY_HANDLE_QUERY,
    variables: { handle },
    next: { revalidate: 3600 },
  });

  const product = data.product;
  if (!product) return null;

  const capacity = findMetafield(product.metafields, "personcap");
  const heatStyle = findMetafield(product.metafields, "heat_style");
  const specSheet = findMetafield(product.metafields, "productspecs");
  const heaterOptionsField = findMetafield(product.metafields, "eheater_options");

  let heaterOptions: string[] = [];
  if (heaterOptionsField?.value) {
    try {
      const parsed = JSON.parse(heaterOptionsField.value);
      if (Array.isArray(parsed)) {
        heaterOptions = parsed.filter((v): v is string => typeof v === "string");
      }
    } catch {
      // Not a JSON list — ignore rather than surface malformed data.
    }
  }

  const compareAtAmount = product.compareAtPriceRange.minVariantPrice.amount;

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    vendor: product.vendor,
    descriptionHtml: product.descriptionHtml,
    price: product.priceRange.minVariantPrice.amount,
    compareAtPrice:
      Number(compareAtAmount) > Number(product.priceRange.minVariantPrice.amount)
        ? compareAtAmount
        : null,
    currencyCode: product.priceRange.minVariantPrice.currencyCode,
    collectionTitle: product.collections.nodes[0]?.title ?? null,
    media: product.media.nodes
      .filter((m): m is typeof m & { image: NonNullable<typeof m.image> } =>
        Boolean(m.image)
      )
      .map((m) => ({ id: m.id, url: m.image.url, alt: m.image.altText })),
    firstVariantId: product.variants.nodes[0]?.id ?? null,
    capacity: capacity?.value ?? null,
    heatStyle: heatStyle?.value ?? null,
    specSheetUrl: specSheet?.reference?.url ?? null,
    heaterOptions,
  };
}
