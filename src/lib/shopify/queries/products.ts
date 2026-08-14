// Shopify's Storefront API doesn't offer a batched "products by handles"
// lookup, so each product is fetched individually via `product(handle:)`.
export const PRODUCT_BY_HANDLE_QUERY = `#graphql
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
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
  }
`;

export interface ProductByHandleQueryData {
  product: {
    id: string;
    title: string;
    handle: string;
    featuredImage: {
      url: string;
      altText: string | null;
    } | null;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
  } | null;
}

// Powers the admin "pick a product to feature" dropdown (Promotions
// settings) — 28 active products at last count, well within a single page,
// so no pagination/search is needed yet.
export const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts {
    products(first: 250, sortKey: TITLE) {
      nodes {
        handle
        title
      }
    }
  }
`;

export interface AllProductsQueryData {
  products: {
    nodes: Array<{ handle: string; title: string }>;
  };
}

// Sauna product template (SSES-006: presentation only — commerce data is
// read live, nothing here duplicates Shopify's pricing/inventory/cart).
export const PRODUCT_DETAIL_BY_HANDLE_QUERY = `#graphql
  query ProductDetailByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      descriptionHtml
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
        }
      }
      collections(first: 1) {
        nodes {
          title
          handle
        }
      }
      media(first: 20) {
        nodes {
          ... on MediaImage {
            id
            image {
              url
              altText
            }
          }
        }
      }
      variants(first: 1) {
        nodes {
          id
        }
      }
      metafields(
        identifiers: [
          { namespace: "custom", key: "personcap" }
          { namespace: "custom", key: "heat_style" }
          { namespace: "custom", key: "productspecs" }
          { namespace: "custom", key: "eheater_options" }
          { namespace: "custom", key: "show_qty" }
          { namespace: "custom", key: "show_vendor" }
          { namespace: "custom", key: "show_collection" }
        ]
      ) {
        key
        value
        type
        reference {
          ... on GenericFile {
            url
          }
        }
      }
    }
  }
`;

// Powers the "Enhance Your Experience" add-ons section (Enhanced Product
// Template only) — reads the same `custom.addon_items` metaobject list the
// legacy theme used, each entry referencing a specific variant to add.
export const PRODUCT_ADDONS_QUERY = `#graphql
  query ProductAddons($handle: String!) {
    product(handle: $handle) {
      metafield(namespace: "custom", key: "addon_items") {
        references(first: 20) {
          nodes {
            ... on Metaobject {
              id
              fields {
                key
                value
                reference {
                  ... on ProductVariant {
                    id
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export interface ProductAddonsQueryData {
  product: {
    metafield: {
      references: {
        nodes: Array<{
          id: string;
          fields: Array<{
            key: string;
            value: string | null;
            reference: {
              id: string;
              price: { amount: string; currencyCode: string };
            } | null;
          }>;
        }>;
      };
    } | null;
  } | null;
}

export interface ProductDetailQueryData {
  product: {
    id: string;
    title: string;
    handle: string;
    vendor: string;
    descriptionHtml: string;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    compareAtPriceRange: {
      minVariantPrice: { amount: string };
    };
    collections: {
      nodes: Array<{ title: string; handle: string }>;
    };
    media: {
      nodes: Array<{
        id: string;
        image?: { url: string; altText: string | null };
      }>;
    };
    variants: {
      nodes: Array<{ id: string }>;
    };
    metafields: Array<{
      key: string;
      value: string;
      type: string;
      reference: { url: string } | null;
    } | null>;
  } | null;
}
