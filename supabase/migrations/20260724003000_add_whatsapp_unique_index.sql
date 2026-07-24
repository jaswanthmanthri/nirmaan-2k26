create or replace function public.prevent_duplicate_participant_whatsapp()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from public.participants p
    where p.whatsapp = new.whatsapp
      and p.id <> new.id
  ) then
    raise exception 'One of these WhatsApp numbers is already registered.'
      using errcode = '23505';
  end if;

  return new;
end;
$$;

drop trigger if exists participants_prevent_duplicate_whatsapp on public.participants;
create trigger participants_prevent_duplicate_whatsapp
before insert or update of whatsapp on public.participants
for each row
execute function public.prevent_duplicate_participant_whatsapp();
