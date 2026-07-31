import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Absolute origin used when building links that must work outside a
// request context (Supabase email redirect URLs, invite links). e.g.
// https://soothingsaunas.com in production, http://localhost:3000 in dev.
export const siteUrl = required("SITE_URL").replace(/\/$/, "");
