import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Accept the domain with or without a protocol prefix — Shopify's Headless
// channel setup screens don't consistently show it one way or the other.
function normalizeDomain(domain: string): string {
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export const shopifyEnv = {
  domain: normalizeDomain(required("SHOPIFY_STORE_DOMAIN")),
  privateToken: required("SHOPIFY_STORE_PRIVATE_TOKEN"),
};
