-- Admin-selectable "featured product" placements. Direct-save, one row per
-- named slot (e.g. "homepage-featured") — mirrors the site_images slot
-- convention, but stores a Shopify product handle instead of an uploaded
-- image. The admin picks from a live dropdown of active Shopify products
-- (see src/lib/shopify/products.ts's listAllProducts), so a saved handle is
-- always valid at save time — it can only go stale later if the product is
-- deleted/renamed in Shopify afterward, in which case the storefront simply
-- hides the section (see FeaturedExperience's null-product guard) rather
-- than breaking.
create table if not exists featured_products (
  id uuid primary key default gen_random_uuid(),
  slot text not null unique,
  product_handle text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

alter table featured_products enable row level security;
