begin;

create extension if not exists "pgcrypto";

create or replace function public.purchase_ticket(
  p_user_id text,
  p_ticket_id text,
  p_quantity int,
  p_payment_method_type text,
  p_payment_provider_label text
)
returns table (
  order_id text,
  total_amount numeric,
  first_user_ticket_id text
)
language plpgsql
security definer
as $$
declare
  v_event_id text;
  v_ticket_name text;
  v_unit_price numeric(14, 2);
  v_remaining int;
  v_order_id text;
  v_order_item_id text;
  v_payment_id text;
  v_payment_method_id text;
  v_ticket_counter int;
  v_created_ticket_id text;
begin
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'INVALID_QUANTITY';
  end if;

  select
    et.event_id,
    et.name,
    et.price,
    et.remaining
  into
    v_event_id,
    v_ticket_name,
    v_unit_price,
    v_remaining
  from public.event_tickets et
  where et.id = p_ticket_id
  for update;

  if v_event_id is null then
    raise exception 'TICKET_NOT_FOUND';
  end if;

  if v_remaining < p_quantity then
    raise exception 'NOT_ENOUGH_TICKETS';
  end if;

  update public.event_tickets
  set remaining = remaining - p_quantity
  where id = p_ticket_id;

  v_order_id := 'ord_' || replace(gen_random_uuid()::text, '-', '');

  insert into public.orders (
    id,
    user_id,
    status,
    currency,
    subtotal,
    discount,
    fee,
    total,
    created_at,
    paid_at
  )
  values (
    v_order_id,
    p_user_id,
    'paid',
    'VND',
    (v_unit_price * p_quantity),
    0,
    0,
    (v_unit_price * p_quantity),
    now(),
    now()
  );

  v_order_item_id := 'oi_' || replace(gen_random_uuid()::text, '-', '');

  insert into public.order_items (
    id,
    order_id,
    event_id,
    ticket_id,
    ticket_name,
    quantity,
    unit_price,
    line_total
  )
  values (
    v_order_item_id,
    v_order_id,
    v_event_id,
    p_ticket_id,
    v_ticket_name,
    p_quantity,
    v_unit_price,
    (v_unit_price * p_quantity)
  );

  select pm.id
  into v_payment_method_id
  from public.payment_methods pm
  where pm.user_id = p_user_id
    and pm.type = p_payment_method_type::payment_method_type
    and pm.status = 'active'
  order by pm.is_default desc, pm.created_at desc
  limit 1;

  if v_payment_method_id is null then
    v_payment_method_id := 'pm_' || replace(gen_random_uuid()::text, '-', '');
    insert into public.payment_methods (
      id,
      user_id,
      type,
      provider_label,
      token_ref,
      status,
      is_default,
      created_at,
      updated_at
    )
    values (
      v_payment_method_id,
      p_user_id,
      p_payment_method_type::payment_method_type,
      p_payment_provider_label,
      'tok_auto_' || replace(gen_random_uuid()::text, '-', ''),
      'active',
      false,
      now(),
      now()
    );
  end if;

  v_payment_id := 'pay_' || replace(gen_random_uuid()::text, '-', '');

  insert into public.payments (
    id,
    order_id,
    user_id,
    method_id,
    provider,
    amount,
    currency,
    status,
    transaction_ref,
    created_at,
    confirmed_at
  )
  values (
    v_payment_id,
    v_order_id,
    p_user_id,
    v_payment_method_id,
    p_payment_method_type::payment_method_type,
    (v_unit_price * p_quantity),
    'VND',
    'success',
    'AUTO-' || replace(gen_random_uuid()::text, '-', ''),
    now(),
    now()
  );

  v_created_ticket_id := null;

  for v_ticket_counter in 1..p_quantity loop
    first_user_ticket_id := 'ut_' || replace(gen_random_uuid()::text, '-', '');

    if v_created_ticket_id is null then
      v_created_ticket_id := first_user_ticket_id;
    end if;

    insert into public.user_tickets (
      id,
      user_id,
      order_id,
      event_id,
      ticket_id,
      qr_code,
      barcode,
      status,
      issued_at
    )
    values (
      first_user_ticket_id,
      p_user_id,
      v_order_id,
      v_event_id,
      p_ticket_id,
      'ECOM-QR-' || first_user_ticket_id,
      'ECOM-BAR-' || first_user_ticket_id,
      'valid',
      now()
    );
  end loop;

  order_id := v_order_id;
  total_amount := (v_unit_price * p_quantity);
  first_user_ticket_id := v_created_ticket_id;
  return next;
end;
$$;

grant execute on function public.purchase_ticket(text, text, int, text, text) to anon, authenticated;

commit;
