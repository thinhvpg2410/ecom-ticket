begin;

alter table public.app_users
  add column if not exists avatar_base64 text;

commit;
