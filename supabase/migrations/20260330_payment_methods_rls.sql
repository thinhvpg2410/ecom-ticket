begin;

alter table public.payment_methods enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'payment_methods'
      and policyname = 'Users select own payment_methods'
  ) then
    create policy "Users select own payment_methods"
      on public.payment_methods
      for select
      to authenticated
      using (auth.uid()::text = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'payment_methods'
      and policyname = 'Users insert own payment_methods'
  ) then
    create policy "Users insert own payment_methods"
      on public.payment_methods
      for insert
      to authenticated
      with check (auth.uid()::text = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'payment_methods'
      and policyname = 'Users update own payment_methods'
  ) then
    create policy "Users update own payment_methods"
      on public.payment_methods
      for update
      to authenticated
      using (auth.uid()::text = user_id)
      with check (auth.uid()::text = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'payment_methods'
      and policyname = 'Users delete own payment_methods'
  ) then
    create policy "Users delete own payment_methods"
      on public.payment_methods
      for delete
      to authenticated
      using (auth.uid()::text = user_id);
  end if;
end $$;

commit;
