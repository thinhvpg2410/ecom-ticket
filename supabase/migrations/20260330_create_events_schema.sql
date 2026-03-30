-- Migration: create event domain tables
-- Run in Supabase SQL Editor or via migration tool

begin;

-- ===== ENUMS =====
do $$
begin
  if not exists (select 1 from pg_type where typname = 'event_category') then
    create type event_category as enum (
      'Xu hướng',
      'Tham quan & trải nghiệm',
      'Sân khấu & nghệ thuật',
      'Thể thao'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'event_type') then
    create type event_type as enum ('concert', 'event');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'event_location') then
    create type event_location as enum ('Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Other');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'event_status') then
    create type event_status as enum ('draft', 'published', 'cancelled', 'ended');
  end if;
end $$;

-- ===== HELPERS =====
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ===== TABLES =====
create table if not exists public.organizers (
  id text primary key,
  name text not null unique,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id text primary key,
  title text not null,
  image_url text,
  date_display text not null,
  category event_category not null,
  is_trending boolean not null default false,
  location event_location not null,
  type event_type not null default 'event',
  description text not null,
  organizer_id text not null references public.organizers(id) on delete restrict,
  status event_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_tickets (
  id text primary key,
  event_id text not null references public.events(id) on delete cascade,
  name text not null,
  price numeric(14, 2) not null default 0,
  remaining int not null default 0 check (remaining >= 0),
  benefits jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===== INDEXES =====
create index if not exists idx_events_category on public.events(category);
create index if not exists idx_events_location on public.events(location);
create index if not exists idx_events_is_trending on public.events(is_trending);
create index if not exists idx_events_organizer_id on public.events(organizer_id);
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_event_tickets_event_id on public.event_tickets(event_id);

-- ===== TRIGGERS =====
drop trigger if exists trg_organizers_updated_at on public.organizers;
create trigger trg_organizers_updated_at
before update on public.organizers
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at
before update on public.events
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_event_tickets_updated_at on public.event_tickets;
create trigger trg_event_tickets_updated_at
before update on public.event_tickets
for each row execute procedure public.set_updated_at();

-- ===== OPTIONAL: align order items with events =====
-- Uncomment after cleaning legacy rows if needed.
-- alter table public.order_items
--   add constraint fk_order_items_event_id
--   foreign key (event_id) references public.events(id);
--
-- alter table public.order_items
--   add constraint fk_order_items_ticket_id
--   foreign key (ticket_id) references public.event_tickets(id);

commit;
