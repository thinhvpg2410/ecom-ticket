begin;

-- Tránh lồng aggregate: jsonb_agg không được bọc trực tiếp sum/count cùng GROUP BY.
-- Tính theo ngày trong subquery, rồi jsonb_agg một lớp.
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

commit;
