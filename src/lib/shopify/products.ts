import "server-only";
import { shopifyFetch } from "./client";
import {
  PRODUCT_BY_HANDLE_QUERY,
  type ProductByHandleQueryData,
  PRODUCT_DETAIL_BY_HANDLE_QUERY,
  type ProductDetailQueryData,
  ALL_PRODUCTS_QUERY,
  type AllProductsQueryData,
  PRODUCT_ADDONS_QUERY,
  type ProductAddonsQueryData,
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

export interface ProductOption {
  handle: string;
  title: string;
}

// Admin-only product picker source — every active product's handle/title,
// used to populate a dropdown so a saved handle is always a real, live
// product rather than a hand-typed string.
export async function listAllProducts(): Promise<ProductOption[]> {
  const data = await shopifyFetch<AllProductsQueryData>({
    query: ALL_PRODUCTS_QUERY,
    next: { revalidate: 300 },
  });

  return data.products.nodes;
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
  /** `custom.show_qty` boolean metafield — hides the PDP quantity selector when false/unset. */
  showQuantitySelector: boolean;
  /** `custom.show_vendor` boolean metafield — Enhanced Product Template only. */
  showVendor: boolean;
  /** `custom.show_collection` boolean metafield — Enhanced Product Template only. */
  showCollection: boolean;
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
  const showQtyField = findMetafield(product.metafields, "show_qty");
  const showVendorField = findMetafield(product.metafields, "show_vendor");
  const showCollectionField = findMetafield(product.metafields, "show_collection");

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
    showQuantitySelector: showQtyField?.value === "true",
    showVendor: showVendorField?.value === "true",
    showCollection: showCollectionField?.value === "true",
  };
}

export interface ProductAddon {
  id: string;
  label: string;
  variantId: string;
  basePrice: string;
  currencyCode: string;
  /** Percentage 0-100, from the `discount` metaobject field. */
  discountPercent: number;
  finalPrice: number;
}

// "Enhance Your Experience" add-ons (Enhanced Product Template) — each
// `addon_items` metaobject entry references a specific variant to add, plus
// a display label and an optional discount percentage.
export async function getProductAddons(handle: string): Promise<ProductAddon[]> {
  const data = await shopifyFetch<ProductAddonsQueryData>({
    query: PRODUCT_ADDONS_QUERY,
    variables: { handle },
    next: { revalidate: 3600 },
  });

  const nodes = data.product?.metafield?.references.nodes ?? [];

  return nodes
    .map((node) => {
      const fields = node.fields;
      const label = fields.find((f) => f.key === "label")?.value ?? null;
      const discountPercent = Number(fields.find((f) => f.key === "discount")?.value ?? 0);
      const variant = fields.find((f) => f.key === "variant")?.reference ?? null;

      if (!label || !variant) return null;

      const basePrice = Number(variant.price.amount);
      const finalPrice = basePrice - (basePrice * discountPercent) / 100;

      return {
        id: node.id,
        label,
        variantId: variant.id,
        basePrice: variant.price.amount,
        currencyCode: variant.price.currencyCode,
        discountPercent,
        finalPrice,
      };
    })
    .filter((addon): addon is ProductAddon => addon !== null);
}
