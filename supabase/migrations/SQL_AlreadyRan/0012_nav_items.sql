-- Admin-editable destinations for the header nav, footer nav, and homepage
-- hero CTAs — lets an admin change where an item points, hide it, reorder
-- it, or add/remove items without a code deploy. One table for all three
-- locations (header/footer/hero) rather than three, since the shape only
-- differs by two location-scoped columns (group_label for footer, variant
-- for hero) enforced via check constraints below.
--
-- The header's "Saunas" item is deliberately NOT represented here — it's a
-- hover mega-menu trigger, not a plain link, and stays hardcoded in
-- SiteHeader.tsx.
create table if not exists nav_items (
  id uuid primary key default gen_random_uuid(),
  location text not null check (location in ('header','footer','hero')),
  -- Only set for footer items — which of the 4 fixed footer columns this
  -- link belongs to. The footer's grid-cols-5 layout is hardcoded to
  -- exactly these 4 link columns + logo, so this is a closed set, not a
  -- free-text group name.
  group_label text,
  title text not null,
  href text not null,
  -- Only set for hero items — which SsButton style this CTA renders as.
  variant text check (variant in ('primary-dark','outline-dark')),
  -- Footer-only visual de-emphasis (used today for the "Admin" link).
  dimmed boolean not null default false,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id),
  constraint nav_items_footer_group_check check (
    (location = 'footer' and group_label in ('Shop','Learn','Support','Company'))
    or (location <> 'footer' and group_label is null)
  ),
  constraint nav_items_hero_variant_check check (
    (location = 'hero' and variant is not null)
    or (location <> 'hero' and variant is null)
  )
);

create index if not exists nav_items_location_idx
  on nav_items (location, group_label, sort_order) where visible;

alter table nav_items enable row level security;

-- Seed with today's exact live content so nothing changes visually the
-- moment this migration runs. Items with no real destination today
-- (decorative buttons/spans with zero href) seed to '#' as a harmless
-- placeholder until an admin fills in a real URL via the new Site
-- Navigation admin screen.
insert into nav_items (location, group_label, title, href, variant, dimmed, sort_order) values
  -- Header (flat list; excludes "Saunas", which stays hardcoded)
  ('header', null, 'Cold & Water', '#', null, false, 10),
  ('header', null, 'Wellness', '#', null, false, 20),
  ('header', null, 'Accessories', '#', null, false, 30),
  ('header', null, 'Learn', '#', null, false, 40),
  ('header', null, 'Find Your Fit', '/quiz', null, false, 50),

  -- Footer — Shop
  ('footer', 'Shop', 'Saunas', '#', null, false, 10),
  ('footer', 'Shop', 'Cold & Water', '#', null, false, 20),
  ('footer', 'Shop', 'Wellness', '#', null, false, 30),
  ('footer', 'Shop', 'Accessories', '#', null, false, 40),

  -- Footer — Learn
  ('footer', 'Learn', 'Buying Guides', '#', null, false, 10),
  ('footer', 'Learn', 'Wellness Education', '#', null, false, 20),
  ('footer', 'Learn', 'Find Your Fit Quiz', '/quiz', null, false, 30),

  -- Footer — Support
  ('footer', 'Support', 'Contact', '#', null, false, 10),
  ('footer', 'Support', 'Shipping', '#', null, false, 20),
  ('footer', 'Support', 'Returns', '#', null, false, 30),
  ('footer', 'Support', 'Warranty', '#', null, false, 40),

  -- Footer — Company
  ('footer', 'Company', 'About Us', '/about', null, false, 10),
  ('footer', 'Company', 'Privacy', '#', null, false, 20),
  ('footer', 'Company', 'Terms', '#', null, false, 30),
  ('footer', 'Company', 'Accessibility', '#', null, false, 40),
  ('footer', 'Company', 'Sitemap', '#', null, false, 50),
  ('footer', 'Company', 'Admin', '/store-settings', null, true, 60),

  -- Hero (today's exact live buttons)
  ('hero', null, 'Explore Saunas', '/collections/all-saunas', 'primary-dark', false, 10),
  ('hero', null, 'Find Your Fit', '/quiz', 'outline-dark', false, 20);
