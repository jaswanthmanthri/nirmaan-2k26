# admin-registrations

Protected organizer endpoint for the `/admin` dashboard.

Required Supabase secret:

```bash
supabase secrets set ADMIN_ACCESS_TOKEN=make-a-long-random-admin-password
```

The frontend asks organizers to enter this token. It is sent as `x-admin-token` only for admin requests and is not stored in the deployed app bundle.
