alter table site_images
  add column if not exists focal_x smallint not null default 50 check (focal_x between 0 and 100),
  add column if not exists focal_y smallint not null default 50 check (focal_y between 0 and 100);
