# submit-registration

Secure registration endpoint for NIRMAAN 2K26.

Required Supabase secrets:

```bash
supabase secrets set RESEND_API_KEY=your_resend_key
supabase secrets set CONFIRMATION_EMAIL_FROM="NIRMAAN 2K26 <registrations@yourdomain.com>"
```

`CONFIRMATION_EMAIL_FROM` can temporarily use Resend's test sender during development, but production email should use a verified domain.
