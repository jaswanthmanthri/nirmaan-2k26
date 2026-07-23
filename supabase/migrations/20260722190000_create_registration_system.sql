create extension if not exists pgcrypto;

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  team_name text not null,
  team_name_normalized text not null,
  plan text not null check (plan in ('duo', 'trio', 'squad')),
  team_size integer not null check (team_size in (2, 3, 4)),
  price integer not null check (price > 0),
  transaction_id text not null,
  transaction_id_normalized text not null,
  screenshot_path text not null,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'verified', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint registrations_team_name_unique unique (team_name_normalized),
  constraint registrations_transaction_id_unique unique (transaction_id_normalized)
);

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  role text not null check (role in ('lead', 'member')),
  full_name text not null,
  email text not null,
  email_normalized text not null,
  whatsapp text not null,
  gender text not null,
  college text not null,
  stream text not null,
  year text not null,
  created_at timestamptz not null default now(),
  constraint participants_email_unique unique (email_normalized)
);

create index if not exists participants_registration_id_idx
  on public.participants(registration_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists registrations_set_updated_at on public.registrations;
create trigger registrations_set_updated_at
before update on public.registrations
for each row
execute function public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-screenshots',
  'payment-screenshots',
  false,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.registrations enable row level security;
alter table public.participants enable row level security;

create policy "No public registration reads"
on public.registrations
for select
to anon, authenticated
using (false);

create policy "No public participant reads"
on public.participants
for select
to anon, authenticated
using (false);

create policy "No public screenshot reads"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'payment-screenshots' and false);

create or replace function public.get_registration_export()
returns table (
  registration_id uuid,
  team_name text,
  plan text,
  team_size integer,
  price integer,
  transaction_id text,
  payment_status text,
  screenshot_path text,
  registered_at timestamptz,
  participant_role text,
  participant_name text,
  participant_email text,
  participant_whatsapp text,
  participant_gender text,
  participant_college text,
  participant_stream text,
  participant_year text
)
language sql
security definer
set search_path = public
as $$
  select
    r.id,
    r.team_name,
    r.plan,
    r.team_size,
    r.price,
    r.transaction_id,
    r.payment_status,
    r.screenshot_path,
    r.created_at,
    p.role,
    p.full_name,
    p.email,
    p.whatsapp,
    p.gender,
    p.college,
    p.stream,
    p.year
  from public.registrations r
  join public.participants p on p.registration_id = r.id
  order by r.created_at desc, case p.role when 'lead' then 0 else 1 end, p.created_at asc;
$$;

revoke all on function public.get_registration_export() from public, anon, authenticated;
grant execute on function public.get_registration_export() to service_role;
