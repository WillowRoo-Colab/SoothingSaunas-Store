export const COLLECTIONS_QUERY = `#graphql
  query Collections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

export interface CollectionsQueryData {
  collections: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        image: {
          url: string;
          altText: string | null;
        } | null;
      };
    }>;
  };
}

// Product filters are deliberately out of scope for now (see
// docs plan — Shopify's native Search & Discovery filters are confirmed
// available but not wired up here yet), so no `filters` argument.
export const COLLECTION_PRODUCTS_QUERY = `#graphql
  query CollectionProducts(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collectionByHandle(handle: $handle) {
      title
      products(
        first: $first
        after: $after
        sortKey: $sortKey
        reverse: $reverse
      ) {
        nodes {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export interface CollectionProductsQueryData {
  collectionByHandle: {
    title: string;
    products: {
      nodes: Array<{
        id: string;
        title: string;
        handle: string;
        featuredImage: { url: string; altText: string | null } | null;
        priceRange: {
          minVariantPrice: { amount: string; currencyCode: string };
        };
      }>;
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  } | null;
}
