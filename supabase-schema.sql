create extension if not exists "pgcrypto";

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  category text default 'General',
  duration text default '00:00',
  thumbnail text,
  video_url text not null,
  video_type text not null default 'embed' check (video_type in ('embed', 'mp4')),
  created_at timestamptz not null default now()
);

create index if not exists videos_created_at_idx on public.videos (created_at desc);

alter table public.videos enable row level security;

drop policy if exists "Public can read videos" on public.videos;
create policy "Public can read videos"
on public.videos
for select
to anon, authenticated
using (true);

drop policy if exists "Public can insert videos" on public.videos;
create policy "Public can insert videos"
on public.videos
for insert
to anon, authenticated
with check (true);

insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can view video bucket files" on storage.objects;
create policy "Public can view video bucket files"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'videos');

drop policy if exists "Public can upload video bucket files" on storage.objects;
create policy "Public can upload video bucket files"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'videos');
