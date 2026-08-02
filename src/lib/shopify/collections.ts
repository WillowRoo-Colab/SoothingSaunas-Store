import "server-only";
import { shopifyFetch } from "./client";
import {
  COLLECTIONS_QUERY,
  type CollectionsQueryData,
  COLLECTION_PRODUCTS_QUERY,
  type CollectionProductsQueryData,
} from "./queries/collections";
import type { StorefrontProduct } from "./products";

export interface Collection {
  id: string;
  title: string;
  handle: string;
  imageUrl: string | null;
  imageAlt: string | null;
}

export async function getCollections(first = 20): Promise<Collection[]> {
  const data = await shopifyFetch<CollectionsQueryData>({
    query: COLLECTIONS_QUERY,
    variables: { first },
    next: { revalidate: 3600 },
  });

  return data.collections.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    imageUrl: node.image?.url ?? null,
    imageAlt: node.image?.altText ?? null,
  }));
}

interface CollectionLeadImageData {
  collectionByHandle: {
    products: {
      edges: Array<{
        node: {
          featuredImage: { url: string; altText: string | null } | null;
        };
      }>;
    };
  } | null;
}

const COLLECTION_LEAD_IMAGE_QUERY = `#graphql
  query CollectionLeadImage($handle: String!) {
    collectionByHandle(handle: $handle) {
      products(first: 1) {
        edges {
          node {
            featuredImage {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

// Fallback for collections with no image of their own (common gap in this
// catalog today): use the first product's photo as a representative visual.
export async function getCollectionLeadImage(
  handle: string
): Promise<{ url: string; alt: string | null } | null> {
  const data = await shopifyFetch<CollectionLeadImageData>({
    query: COLLECTION_LEAD_IMAGE_QUERY,
    variables: { handle },
    next: { revalidate: 3600 },
  });

  const image = data.collectionByHandle?.products.edges[0]?.node.featuredImage;
  return image ? { url: image.url, alt: image.altText } : null;
}

export type CollectionProductsSortKey =
  | "COLLECTION_DEFAULT"
  | "PRICE"
  | "BEST_SELLING"
  | "CREATED"
  | "TITLE";

export interface CollectionProductsResult {
  title: string;
  products: StorefrontProduct[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

// No `filters` argument yet — product filtering is on hold until the
// underlying Shopify metafields are in place (see project plan notes).
export async function getCollectionProducts(
  handle: string,
  {
    first = 24,
    after,
    sortKey = "COLLECTION_DEFAULT",
    reverse = false,
  }: {
    first?: number;
    after?: string;
    sortKey?: CollectionProductsSortKey;
    reverse?: boolean;
  } = {}
): Promise<CollectionProductsResult | null> {
  const data = await shopifyFetch<CollectionProductsQueryData>({
    query: COLLECTION_PRODUCTS_QUERY,
    variables: { handle, first, after, sortKey, reverse },
    next: { revalidate: 3600 },
  });

  const collection = data.collectionByHandle;
  if (!collection) return null;

  return {
    title: collection.title,
    products: collection.products.nodes.map((node) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      imageUrl: node.featuredImage?.url ?? null,
      imageAlt: node.featuredImage?.altText ?? null,
      price: node.priceRange.minVariantPrice.amount,
      currencyCode: node.priceRange.minVariantPrice.currencyCode,
    })),
    pageInfo: collection.products.pageInfo,
  };
}
