-- Supabase seed script for ecom-ticket mock data
-- Run this in Supabase SQL Editor

begin;

create extension if not exists "pgcrypto";

-- ===== ENUMS =====
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

-- ===== TABLES =====
create table if not exists public.app_users (
  id text primary key,
  full_name text not null,
  email text not null unique,
  phone text not null,
  role user_role not null,
  avatar_url text,
  created_at timestamptz not null,
  status user_status not null
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
  status payment_method_status not null,
  is_default boolean not null default false,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.carts (
  id text primary key,
  user_id text not null references public.app_users(id) on delete cascade,
  currency text not null default 'VND',
  subtotal numeric(14, 2) not null default 0,
  updated_at timestamptz not null
);

create table if not exists public.cart_items (
  id text primary key,
  cart_id text not null references public.carts(id) on delete cascade,
  event_id text not null,
  ticket_id text not null,
  quantity int not null check (quantity >= 0),
  unit_price numeric(14, 2) not null default 0
);

create table if not exists public.orders (
  id text primary key,
  user_id text not null references public.app_users(id) on delete cascade,
  status order_status not null,
  currency text not null default 'VND',
  subtotal numeric(14, 2) not null default 0,
  discount numeric(14, 2) not null default 0,
  fee numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  created_at timestamptz not null,
  paid_at timestamptz
);

create table if not exists public.order_items (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  event_id text not null,
  ticket_id text not null,
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
  status payment_status not null,
  transaction_ref text not null unique,
  created_at timestamptz not null,
  confirmed_at timestamptz
);

create table if not exists public.user_tickets (
  id text primary key,
  user_id text not null references public.app_users(id) on delete cascade,
  order_id text not null references public.orders(id) on delete cascade,
  event_id text not null,
  ticket_id text not null,
  qr_code text not null,
  barcode text not null,
  status user_ticket_status not null,
  issued_at timestamptz not null
);

create index if not exists idx_payment_methods_user_id on public.payment_methods(user_id);
create index if not exists idx_carts_user_id on public.carts(user_id);
create index if not exists idx_cart_items_cart_id on public.cart_items(cart_id);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_payments_order_id on public.payments(order_id);
create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_user_tickets_user_id on public.user_tickets(user_id);
create index if not exists idx_user_tickets_order_id on public.user_tickets(order_id);

-- ===== SEED DATA =====
insert into public.app_users (
  id, full_name, email, phone, role, avatar_url, created_at, status
)
values
  ('u_001', 'Tran Ngoc Bich Ly', 'bichly@example.com', '0901234567', 'customer', 'https://example.com/avatar/u_001.png', '2026-03-01T08:20:00Z', 'active'),
  ('u_002', 'Nguyen Minh Quan', 'quan@example.com', '0912345678', 'customer', null, '2026-03-05T10:10:00Z', 'active'),
  ('u_003', 'ECOM Admin', 'admin@ecomticket.vn', '0988888888', 'admin', null, '2026-02-20T02:30:00Z', 'active')
on conflict (id) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  role = excluded.role,
  avatar_url = excluded.avatar_url,
  created_at = excluded.created_at,
  status = excluded.status;

insert into public.payment_methods (
  id, user_id, type, provider_label, holder_name, brand, last4,
  expiry_month, expiry_year, wallet_phone, token_ref, billing_address,
  status, is_default, created_at, updated_at
)
values
  ('pm_001', 'u_001', 'momo', 'Momo Wallet', null, null, null, null, null, '0901234567', 'tok_momo_u001_01', null, 'active', true, '2026-03-01T08:30:00Z', '2026-03-25T01:10:00Z'),
  ('pm_002', 'u_001', 'visa', 'VISA •••• 3490', 'TRAN NGOC BICH LY', 'VISA', '3490', 12, 2028, null, 'tok_card_u001_02', '{"line1":"12 Nguyen Hue","district":"Quan 1","city":"Ho Chi Minh","country":"VN","postalCode":"700000"}'::jsonb, 'active', false, '2026-03-06T10:00:00Z', '2026-03-06T10:00:00Z'),
  ('pm_003', 'u_002', 'vnpay', 'VNPay Mobile Banking', null, null, null, null, null, null, 'tok_vnpay_u002_01', null, 'active', true, '2026-03-12T05:12:00Z', '2026-03-12T05:12:00Z')
on conflict (id) do update set
  user_id = excluded.user_id,
  type = excluded.type,
  provider_label = excluded.provider_label,
  holder_name = excluded.holder_name,
  brand = excluded.brand,
  last4 = excluded.last4,
  expiry_month = excluded.expiry_month,
  expiry_year = excluded.expiry_year,
  wallet_phone = excluded.wallet_phone,
  token_ref = excluded.token_ref,
  billing_address = excluded.billing_address,
  status = excluded.status,
  is_default = excluded.is_default,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.carts (
  id, user_id, currency, subtotal, updated_at
)
values
  ('cart_001', 'u_001', 'VND', 650000, '2026-03-30T03:55:00Z'),
  ('cart_002', 'u_002', 'VND', 120000, '2026-03-29T14:20:00Z')
on conflict (id) do update set
  user_id = excluded.user_id,
  currency = excluded.currency,
  subtotal = excluded.subtotal,
  updated_at = excluded.updated_at;

insert into public.cart_items (
  id, cart_id, event_id, ticket_id, quantity, unit_price
)
values
  ('ci_001', 'cart_001', 'e2', 'e2-1', 2, 250000),
  ('ci_002', 'cart_001', 'e11', 'e11-1', 1, 150000),
  ('ci_003', 'cart_002', 'e4', 'e4-1', 1, 120000)
on conflict (id) do update set
  cart_id = excluded.cart_id,
  event_id = excluded.event_id,
  ticket_id = excluded.ticket_id,
  quantity = excluded.quantity,
  unit_price = excluded.unit_price;

insert into public.orders (
  id, user_id, status, currency, subtotal, discount, fee, total, created_at, paid_at
)
values
  ('ord_1001', 'u_001', 'paid', 'VND', 500000, 0, 0, 500000, '2026-03-30T04:10:00Z', '2026-03-30T04:12:00Z'),
  ('ord_1002', 'u_002', 'pending', 'VND', 120000, 10000, 0, 110000, '2026-03-30T05:00:00Z', null)
on conflict (id) do update set
  user_id = excluded.user_id,
  status = excluded.status,
  currency = excluded.currency,
  subtotal = excluded.subtotal,
  discount = excluded.discount,
  fee = excluded.fee,
  total = excluded.total,
  created_at = excluded.created_at,
  paid_at = excluded.paid_at;

insert into public.order_items (
  id, order_id, event_id, ticket_id, ticket_name, quantity, unit_price, line_total
)
values
  ('oi_001', 'ord_1001', 'e2', 'e2-1', 'Standard', 2, 250000, 500000),
  ('oi_002', 'ord_1002', 'e4', 'e4-1', 'Standard', 1, 120000, 120000)
on conflict (id) do update set
  order_id = excluded.order_id,
  event_id = excluded.event_id,
  ticket_id = excluded.ticket_id,
  ticket_name = excluded.ticket_name,
  quantity = excluded.quantity,
  unit_price = excluded.unit_price,
  line_total = excluded.line_total;

insert into public.payments (
  id, order_id, user_id, method_id, provider, amount, currency, status, transaction_ref, created_at, confirmed_at
)
values
  ('pay_9001', 'ord_1001', 'u_001', 'pm_001', 'momo', 500000, 'VND', 'success', 'MOMO-TRX-20260330-0001', '2026-03-30T04:11:00Z', '2026-03-30T04:12:00Z'),
  ('pay_9002', 'ord_1002', 'u_002', 'pm_003', 'vnpay', 110000, 'VND', 'initiated', 'VNPAY-TRX-20260330-0002', '2026-03-30T05:01:00Z', null)
on conflict (id) do update set
  order_id = excluded.order_id,
  user_id = excluded.user_id,
  method_id = excluded.method_id,
  provider = excluded.provider,
  amount = excluded.amount,
  currency = excluded.currency,
  status = excluded.status,
  transaction_ref = excluded.transaction_ref,
  created_at = excluded.created_at,
  confirmed_at = excluded.confirmed_at;

insert into public.user_tickets (
  id, user_id, order_id, event_id, ticket_id, qr_code, barcode, status, issued_at
)
values
  ('ut_001', 'u_001', 'ord_1001', 'e2', 'e2-1', 'ECOM-QR-ut_001', 'ECOM-BAR-ut_001', 'valid', '2026-03-30T04:13:00Z'),
  ('ut_002', 'u_001', 'ord_1001', 'e2', 'e2-1', 'ECOM-QR-ut_002', 'ECOM-BAR-ut_002', 'valid', '2026-03-30T04:13:00Z')
on conflict (id) do update set
  user_id = excluded.user_id,
  order_id = excluded.order_id,
  event_id = excluded.event_id,
  ticket_id = excluded.ticket_id,
  qr_code = excluded.qr_code,
  barcode = excluded.barcode,
  status = excluded.status,
  issued_at = excluded.issued_at;

commit;
