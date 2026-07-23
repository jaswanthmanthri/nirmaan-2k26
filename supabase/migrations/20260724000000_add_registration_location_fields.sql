alter table public.participants
  add column if not exists college_location text not null default '',
  add column if not exists state text not null default '';

update public.participants
set
  college_location = coalesce(college_location, ''),
  state = coalesce(state, '')
where college_location is null
   or state is null;

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
  participant_college_location text,
  participant_state text,
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
    p.college_location,
    p.state,
    p.stream,
    p.year
  from public.registrations r
  join public.participants p on p.registration_id = r.id
  order by r.created_at desc, case p.role when 'lead' then 0 else 1 end, p.created_at asc;
$$;

revoke all on function public.get_registration_export() from public, anon, authenticated;
grant execute on function public.get_registration_export() to service_role;
