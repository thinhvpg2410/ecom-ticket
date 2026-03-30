begin;

-- Chuỗi ngày: doanh thu & số đơn (đơn paid), dùng cho biểu đồ
create or replace function public.admin_revenue_daily_series(p_days int default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  d int := greatest(1, least(coalesce(p_days, 30), 366));
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  return coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'day', t.day::text,
          'revenue', t.revenue,
          'orders', t.orders
        )
        order by t.day
      )
      from (
        select
          s.day,
          coalesce(sum(o.total), 0) as revenue,
          count(o.id)::bigint as orders
        from (
          select generate_series(
            (current_date - (d - 1)),
            current_date,
            '1 day'::interval
          )::date as day
        ) s
        left join public.orders o
          on o.status = 'paid'::order_status
          and coalesce(o.paid_at::date, o.created_at::date) = s.day
        group by s.day
      ) t
    ),
    '[]'::jsonb
  );
end;
$$;

grant execute on function public.admin_revenue_daily_series(int) to authenticated;

-- Tổng hợp thu (subtotal), giảm giá, phí, thực thu — đơn paid
create or replace function public.admin_revenue_breakdown()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  return (
    select jsonb_build_object(
      'gross_subtotal', coalesce(sum(o.subtotal), 0),
      'total_discount', coalesce(sum(o.discount), 0),
      'total_fee', coalesce(sum(o.fee), 0),
      'net_total', coalesce(sum(o.total), 0),
      'orders_paid', count(*)::bigint
    )
    from public.orders o
    where o.status = 'paid'::order_status
  );
end;
$$;

grant execute on function public.admin_revenue_breakdown() to authenticated;

-- Doanh thu theo kênh thanh toán (payment success)
create or replace function public.admin_revenue_by_provider()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  return coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'provider', t.provider,
          'amount', t.amount,
          'count', t.cnt
        )
        order by t.amount desc
      )
      from (
        select
          p.provider::text as provider,
          sum(p.amount) as amount,
          count(*)::bigint as cnt
        from public.payments p
        inner join public.orders o on o.id = p.order_id
        where o.status = 'paid'::order_status
          and p.status = 'success'::payment_status
        group by p.provider
      ) t
    ),
    '[]'::jsonb
  );
end;
$$;

grant execute on function public.admin_revenue_by_provider() to authenticated;

-- Bảng kê đơn đã thanh toán (thu chi theo đơn)
create or replace function public.admin_orders_ledger(p_limit int default 100)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  lim int := greatest(1, least(coalesce(p_limit, 100), 500));
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  return coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'order_id', q.order_id,
          'paid_at', q.paid_at,
          'created_at', q.created_at,
          'full_name', q.full_name,
          'email', q.email,
          'subtotal', q.subtotal,
          'discount', q.discount,
          'fee', q.fee,
          'total', q.total,
          'payment_provider', q.payment_provider
        )
        order by q.sort_key desc
      )
      from (
        select
          o.id as order_id,
          o.paid_at,
          o.created_at,
          u.full_name,
          u.email,
          o.subtotal,
          o.discount,
          o.fee,
          o.total,
          coalesce(o.paid_at, o.created_at) as sort_key,
          (
            select p.provider::text
            from public.payments p
            where p.order_id = o.id
              and p.status = 'success'::payment_status
            order by p.confirmed_at desc nulls last, p.created_at desc
            limit 1
          ) as payment_provider
        from public.orders o
        inner join public.app_users u on u.id = o.user_id
        where o.status = 'paid'::order_status
        order by coalesce(o.paid_at, o.created_at) desc
        limit lim
      ) q
    ),
    '[]'::jsonb
  );
end;
$$;

grant execute on function public.admin_orders_ledger(int) to authenticated;

commit;
