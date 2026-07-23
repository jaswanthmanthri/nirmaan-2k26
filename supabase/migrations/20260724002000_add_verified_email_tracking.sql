alter table public.registrations
  add column if not exists verified_email_sent_at timestamptz,
  add column if not exists verified_email_error text;
