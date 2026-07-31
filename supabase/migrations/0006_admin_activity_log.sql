create table if not exists admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users (id),
  action text not null,
  target text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_activity_log_created_idx
  on admin_activity_log (created_at desc);
create index if not exists admin_activity_log_actor_idx
  on admin_activity_log (actor_user_id);

alter table admin_activity_log enable row level security;
