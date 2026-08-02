-- Reusable scrolling ticker banner instances. Direct-save (no draft/publish
-- workflow — the general settings engine hasn't been built yet), matching
-- the immediate-save convention already used by site_images. Each row is
-- one placement on the site (homepage top, a product-page column, etc.),
-- independently configurable.
create table if not exists scrolling_tickers (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  placement_key text not null,
  enabled boolean not null default true,
  messages jsonb not null default '[]'::jsonb,
  divider_type text not null default 'character' check (divider_type in ('character', 'image')),
  divider_character text,
  divider_image_url text,
  scroll_speed_seconds numeric not null default 20,
  width_mode text not null default 'full' check (width_mode in ('full', 'custom')),
  width_value text,
  -- Constrained to the site's existing approved brand tokens (SSES-007) —
  -- not free hex/font input.
  font_color text not null default 'cream' check (font_color in ('charcoal', 'cream', 'gold', 'silver')),
  font_family text not null default 'sans' check (font_family in ('display', 'sans', 'heading')),
  font_size_px int not null default 14 check (font_size_px between 10 and 32),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

create index if not exists scrolling_tickers_placement_idx
  on scrolling_tickers (placement_key)
  where enabled;

alter table scrolling_tickers enable row level security;
