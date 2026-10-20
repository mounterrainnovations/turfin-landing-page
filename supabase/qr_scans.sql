-- QR scan counts for /apps/user and /apps/vendor (written by proxy.ts via the service role).
-- Run once in Supabase → SQL Editor.
create table if not exists public.qr_scans (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  app        text not null check (app in ('user', 'vendor')),
  platform   text not null check (platform in ('ios', 'android', 'fallback')),
  source     text check (source ~ '^[a-z0-9_-]{1,24}$')
);

create index if not exists qr_scans_created_at_idx on public.qr_scans (created_at);

-- RLS on with no policies: only the service role (server) can read/write
alter table public.qr_scans enable row level security;

-- Example report — scans per day, app, platform and source (IST):
-- select date(created_at at time zone 'Asia/Kolkata') as day, app, platform, coalesce(source, '-') as source, count(*)
-- from public.qr_scans group by 1, 2, 3, 4 order by 1 desc, 2, 3, 4;
