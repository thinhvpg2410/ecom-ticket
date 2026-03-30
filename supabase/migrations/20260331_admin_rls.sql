begin;

-- Helper: current user is admin (app_users.role = 'admin')
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()::text
      and u.role = 'admin'::user_role
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

-- ===== app_users =====
alter table public.app_users enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'app_users' and policyname = 'app_users_select_own'
  ) then
    create policy "app_users_select_own"
      on public.app_users for select
      to authenticated
      using (auth.uid()::text = id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'app_users' and policyname = 'app_users_insert_own'
  ) then
    create policy "app_users_insert_own"
      on public.app_users for insert
      to authenticated
      with check (auth.uid()::text = id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'app_users' and policyname = 'app_users_update_own'
  ) then
    create policy "app_users_update_own"
      on public.app_users for update
      to authenticated
      using (auth.uid()::text = id)
      with check (auth.uid()::text = id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'app_users' and policyname = 'app_users_admin_all'
  ) then
    create policy "app_users_admin_all"
      on public.app_users for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

-- ===== organizers =====
alter table public.organizers enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'organizers' and policyname = 'organizers_public_read'
  ) then
    create policy "organizers_public_read"
      on public.organizers for select
      to anon, authenticated
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'organizers' and policyname = 'organizers_admin_all'
  ) then
    create policy "organizers_admin_all"
      on public.organizers for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

-- ===== events =====
alter table public.events enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'events' and policyname = 'events_public_read_published'
  ) then
    create policy "events_public_read_published"
      on public.events for select
      to anon, authenticated
      using (status = 'published'::event_status);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'events' and policyname = 'events_admin_all'
  ) then
    create policy "events_admin_all"
      on public.events for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

-- ===== event_tickets =====
alter table public.event_tickets enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'event_tickets' and policyname = 'event_tickets_public_read'
  ) then
    create policy "event_tickets_public_read"
      on public.event_tickets for select
      to anon, authenticated
      using (
        exists (
          select 1
          from public.events e
          where e.id = event_tickets.event_id
            and e.status = 'published'::event_status
        )
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'event_tickets' and policyname = 'event_tickets_admin_all'
  ) then
    create policy "event_tickets_admin_all"
      on public.event_tickets for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

-- ===== orders (stats + user orders) =====
alter table public.orders enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'orders' and policyname = 'orders_select_own'
  ) then
    create policy "orders_select_own"
      on public.orders for select
      to authenticated
      using (user_id = auth.uid()::text);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'orders' and policyname = 'orders_admin_all'
  ) then
    create policy "orders_admin_all"
      on public.orders for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

-- ===== order_items =====
alter table public.order_items enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'order_items' and policyname = 'order_items_via_order'
  ) then
    create policy "order_items_via_order"
      on public.order_items for select
      to authenticated
      using (
        exists (
          select 1
          from public.orders o
          where o.id = order_items.order_id
            and o.user_id = auth.uid()::text
        )
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'order_items' and policyname = 'order_items_admin_all'
  ) then
    create policy "order_items_admin_all"
      on public.order_items for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

-- ===== user_tickets =====
alter table public.user_tickets enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_tickets' and policyname = 'user_tickets_select_own'
  ) then
    create policy "user_tickets_select_own"
      on public.user_tickets for select
      to authenticated
      using (user_id = auth.uid()::text);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_tickets' and policyname = 'user_tickets_admin_all'
  ) then
    create policy "user_tickets_admin_all"
      on public.user_tickets for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

-- ===== payments (read) =====
alter table public.payments enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'payments' and policyname = 'payments_select_own'
  ) then
    create policy "payments_select_own"
      on public.payments for select
      to authenticated
      using (user_id = auth.uid()::text);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'payments' and policyname = 'payments_admin_all'
  ) then
    create policy "payments_admin_all"
      on public.payments for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

-- RPC: dashboard stats (admin only)
create or replace function public.admin_dashboard_stats()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  return json_build_object(
    'total_revenue',
      coalesce(
        (select sum(o.total) from public.orders o where o.status = 'paid'::order_status),
        0
      ),
    'tickets_sold',
      (select count(*)::bigint from public.user_tickets),
    'seats_sold',
      coalesce(
        (
          select sum(oi.quantity)::bigint
          from public.order_items oi
          join public.orders o on o.id = oi.order_id
          where o.status = 'paid'::order_status
        ),
        0
      ),
    'orders_paid',
      (select count(*)::bigint from public.orders o where o.status = 'paid'::order_status)
  );
end;
$$;

grant execute on function public.admin_dashboard_stats() to authenticated;

commit;
