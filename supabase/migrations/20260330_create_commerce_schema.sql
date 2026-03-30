begin;

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('customer', 'admin', 'organizer');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_status') then
    create type user_status as enum ('active', 'inactive');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'payment_method_type') then
    create type payment_method_type as enum ('momo', 'visa', 'vnpay');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'payment_method_status') then
    create type payment_method_status as enum ('active', 'disabled');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum ('pending', 'paid', 'cancelled', 'refunded');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type payment_status as enum ('initiated', 'success', 'failed', 'refunded');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_ticket_status') then
    create type user_ticket_status as enum ('valid', 'used', 'expired', 'cancelled');
  end if;
end $$;

create table if not exists public.app_users (
  id text primary key,
  full_name text not null,
  email text not null unique,
  phone text not null,
  role user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now(),
  status user_status not null default 'active'
);

create table if not exists public.payment_methods (
  id text primary key,
  user_id text not null references public.app_users(id) on delete cascade,
  type payment_method_type not null,
  provider_label text not null,
  holder_name text,
  brand text,
  last4 text,
  expiry_month int,
  expiry_year int,
  wallet_phone text,
  token_ref text not null,
  billing_address jsonb,
  status payment_method_status not null default 'active',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  user_id text not null references public.app_users(id) on delete cascade,
  status order_status not null default 'pending',
  currency text not null default 'VND',
  subtotal numeric(14, 2) not null default 0,
  discount numeric(14, 2) not null default 0,
  fee numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.order_items (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  event_id text not null references public.events(id) on delete restrict,
  ticket_id text not null references public.event_tickets(id) on delete restrict,
  ticket_name text not null,
  quantity int not null check (quantity >= 0),
  unit_price numeric(14, 2) not null default 0,
  line_total numeric(14, 2) not null default 0
);

create table if not exists public.payments (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  user_id text not null references public.app_users(id) on delete cascade,
  method_id text not null references public.payment_methods(id) on delete restrict,
  provider payment_method_type not null,
  amount numeric(14, 2) not null default 0,
  currency text not null default 'VND',
  status payment_status not null default 'initiated',
  transaction_ref text not null unique,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create table if not exists public.user_tickets (
  id text primary key,
  user_id text not null references public.app_users(id) on delete cascade,
  order_id text not null references public.orders(id) on delete cascade,
  event_id text not null references public.events(id) on delete restrict,
  ticket_id text not null references public.event_tickets(id) on delete restrict,
  qr_code text not null,
  barcode text not null,
  status user_ticket_status not null default 'valid',
  issued_at timestamptz not null default now()
);

create index if not exists idx_payment_methods_user_id on public.payment_methods(user_id);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_payments_order_id on public.payments(order_id);
create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_user_tickets_user_id on public.user_tickets(user_id);
create index if not exists idx_user_tickets_order_id on public.user_tickets(order_id);

commit;
