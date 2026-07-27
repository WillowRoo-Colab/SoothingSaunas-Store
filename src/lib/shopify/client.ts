import "server-only";
import { shopifyEnv } from "./env";

// Bump quarterly per https://shopify.dev/docs/api/usage/versioning
const API_VERSION = "2026-07";

interface ShopifyGraphQLError {
  message: string;
  path?: (string | number)[];
}

export class ShopifyApiError extends Error {
  readonly errors?: ShopifyGraphQLError[];

  constructor(message: string, errors?: ShopifyGraphQLError[]) {
    super(message);
    this.name = "ShopifyApiError";
    this.errors = errors;
  }
}

interface ShopifyFetchArgs<TVariables> {
  query: string;
  variables?: TVariables;
  /** Next.js fetch cache config — see SSES-012 caching requirements. */
  next?: NextFetchRequestConfig;
}

export async function shopifyFetch<TData, TVariables = Record<string, unknown>>({
  query,
  variables,
  next,
}: ShopifyFetchArgs<TVariables>): Promise<TData> {
  const endpoint = `https://${shopifyEnv.domain}/api/${API_VERSION}/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": shopifyEnv.privateToken,
    },
    body: JSON.stringify({ query, variables }),
    next,
  });

  if (!response.ok) {
    throw new ShopifyApiError(
      `Shopify Storefront API request failed with status ${response.status}`
    );
  }

  const json = (await response.json()) as {
    data?: TData;
    errors?: ShopifyGraphQLError[];
  };

  if (json.errors?.length) {
    throw new ShopifyApiError(json.errors[0].message, json.errors);
  }

  if (!json.data) {
    throw new ShopifyApiError("Shopify Storefront API returned no data");
  }

  return json.data;
}
