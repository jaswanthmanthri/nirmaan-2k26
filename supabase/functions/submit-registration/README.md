# submit-registration

Secure registration endpoint for NIRMAAN 2K26.

Required Supabase secrets:

```bash
supabase secrets set BREVO_API_KEY=your_brevo_api_key
supabase secrets set BREVO_SENDER_NAME="NIRMAAN 2K26"
supabase secrets set BREVO_SENDER_EMAIL="registrations@nirmaan2k26.tech"
supabase secrets set BREVO_REPLY_TO_EMAIL="nirmaanhackathon.2k26@gmail.com"
```

Make sure the sender email is created and verified in Brevo, and authenticate `nirmaan2k26.tech` in Brevo before sending production mail.
