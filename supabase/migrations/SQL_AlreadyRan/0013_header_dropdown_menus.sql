-- Extends nav_items (0012) so any header item can be a dropdown trigger
-- with 1-4 admin-defined columns of child links, instead of a plain link.
-- Also converts today's hardcoded "Saunas" mega-menu (SAUNA_MEGA_MENU in
-- SiteHeader.tsx) into real rows, removing the last hardcoded nav
-- exception — Saunas becomes a normal, fully admin-editable dropdown item.
alter table nav_items
  add column parent_id uuid references nav_items (id) on delete cascade,
  add column column_index integer,
  add column is_dropdown boolean not null default false,
  add column column_count integer,
  add column column_headings jsonb not null default '[]'::jsonb;

alter table nav_items
  add constraint nav_items_dropdown_scope_check check (
    is_dropdown = false or location = 'header'
  ),
  add constraint nav_items_dropdown_columns_check check (
    (is_dropdown = true and column_count between 1 and 4)
    or (is_dropdown = false and column_count is null)
  ),
  add constraint nav_items_column_headings_check check (
    is_dropdown = false or jsonb_array_length(column_headings) = column_count
  ),
  add constraint nav_items_child_check check (
    parent_id is null or (location = 'header' and is_dropdown = false)
  ),
  add constraint nav_items_column_index_check check (
    (parent_id is not null and column_index between 1 and 4)
    or (parent_id is null and column_index is null)
  );

create index if not exists nav_items_parent_idx
  on nav_items (parent_id, column_index, sort_order) where visible;

-- Convert the hardcoded Saunas mega-menu into real rows. sort_order=0 so
-- it still sorts first among header items (Cold & Water etc. start at 10).
-- A dropdown's own href is unused (clicking only opens the menu) — '#' by
-- convention, matching the placeholder used elsewhere for no destination.
do $$
declare
  saunas_id uuid;
begin
  insert into nav_items (location, group_label, title, href, is_dropdown, column_count, column_headings, sort_order)
  values ('header', null, 'Saunas', '#', true, 3, '["Shop by Type","Shop by Space","Start Here"]'::jsonb, 0)
  returning id into saunas_id;

  insert into nav_items (location, parent_id, column_index, title, href, sort_order) values
    ('header', saunas_id, 1, 'Infrared', '#', 10),
    ('header', saunas_id, 1, 'Traditional', '#', 20),
    ('header', saunas_id, 1, 'Steam', '#', 30),
    ('header', saunas_id, 1, 'Outdoor', '#', 40),
    ('header', saunas_id, 1, 'Specialty', '#', 50),
    ('header', saunas_id, 2, 'One Person', '#', 10),
    ('header', saunas_id, 2, 'Two Person', '#', 20),
    ('header', saunas_id, 2, 'Family', '#', 30),
    ('header', saunas_id, 2, 'Indoor', '#', 40),
    ('header', saunas_id, 2, 'Outdoor', '#', 50),
    ('header', saunas_id, 3, 'Compare Sauna Types', '#', 10),
    ('header', saunas_id, 3, 'Sauna Buying Guide', '#', 20),
    ('header', saunas_id, 3, 'Find Your Fit Quiz', '/quiz', 30);
end $$;
