create table if not exists site_images (
  id uuid primary key default gen_random_uuid(),
  slot text not null,
  storage_path text not null,
  public_url text not null,
  original_filename text not null,
  status text not null default 'active' check (status in ('active', 'sunset')),
  uploaded_at timestamptz not null default now()
);

create index if not exists site_images_slot_status_idx
  on site_images (slot, status);

-- RLS is enabled with no policies: this table is only ever read/written by
-- server code using the Supabase secret key, which bypasses RLS by design.
-- No client-side or anon access is intended.
alter table site_images enable row level security;
