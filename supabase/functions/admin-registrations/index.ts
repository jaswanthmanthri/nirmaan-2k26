import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

type AdminAction = 'list' | 'updateStatus' | 'screenshotUrl';
type PaymentStatus = 'pending' | 'verified' | 'rejected';

type AdminPayload = {
  action: AdminAction;
  registrationId?: string;
  status?: PaymentStatus;
  screenshotPath?: string;
};

type RegistrationRow = {
  id: string;
  team_name: string;
  team_size: number;
  price: number;
  transaction_id: string;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  verified_email_sent_at: string | null;
  verified_email_error: string | null;
  participants: Array<{
    id: string;
    role: 'lead' | 'member';
    full_name: string;
    email: string;
    whatsapp: string;
    gender: string;
    college: string;
    college_location: string;
    state: string;
    stream: string;
    year: string;
    created_at: string;
  }>;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const validStatuses = new Set<PaymentStatus>(['pending', 'verified', 'rejected']);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return json({ ok: true });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    assertAdmin(req);

    const payload = await req.json() as AdminPayload;
    const supabase = createClient(
      requiredEnv('SUPABASE_URL'),
      requiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
      { auth: { persistSession: false } },
    );

    if (payload.action === 'list') {
      return await listRegistrations(supabase);
    }

    if (payload.action === 'updateStatus') {
      return await updateStatus(supabase, payload);
    }

    if (payload.action === 'screenshotUrl') {
      return await createScreenshotUrl(supabase, payload);
    }

    return json({ error: 'Unknown admin action.' }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Admin request failed.';
    const status = message === 'Unauthorized admin request.' ? 401 : 400;
    return json({ error: message }, status);
  }
});

async function listRegistrations(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      id,
      team_name,
      plan,
      team_size,
      price,
      transaction_id,
      screenshot_path,
      payment_status,
      created_at,
      updated_at,
      verified_email_sent_at,
      verified_email_error,
      participants (
        id,
        role,
        full_name,
        email,
        whatsapp,
        gender,
        college,
        college_location,
        state,
        stream,
        year,
        created_at
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return json({ registrations: (data ?? []) as RegistrationRow[] });
}

async function updateStatus(supabase: ReturnType<typeof createClient>, payload: AdminPayload) {
  if (!payload.registrationId) {
    throw new Error('Registration ID is required.');
  }

  if (!payload.status || !validStatuses.has(payload.status)) {
    throw new Error('Payment status is invalid.');
  }

  const { data, error } = await supabase
    .from('registrations')
    .update({ payment_status: payload.status })
    .eq('id', payload.registrationId)
    .select('id, payment_status, updated_at, verified_email_sent_at, verified_email_error')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (payload.status === 'verified') {
    const { data: fullRegistration, error: loadError } = await supabase
      .from('registrations')
      .select(`
        id,
        team_name,
        team_size,
        price,
        transaction_id,
        payment_status,
        verified_email_sent_at,
        verified_email_error,
        participants (
          role,
          full_name,
          email
        )
      `)
      .eq('id', payload.registrationId)
      .single();

    if (loadError) {
      throw new Error(loadError.message);
    }

    const registration = fullRegistration as RegistrationRow;
    if (!registration.verified_email_sent_at) {
      const lead = getLead(registration);
      if (lead?.email) {
        const sentAt = new Date().toISOString();
        const emailResult = await sendVerifiedEmail({
          apiKey: Deno.env.get('BREVO_API_KEY') || '',
          senderName: Deno.env.get('BREVO_SENDER_NAME') || 'NIRMAAN 2K26',
          senderEmail: Deno.env.get('BREVO_SENDER_EMAIL') || 'registrations@nirmaan2k26.tech',
          replyToEmail: Deno.env.get('BREVO_REPLY_TO_EMAIL') || 'nirmaanhackathon.2k26@gmail.com',
          to: lead.email,
          leadName: lead.full_name,
          teamName: registration.team_name,
          teamSize: registration.team_size,
          price: registration.price,
          transactionId: registration.transaction_id,
        });

        if (emailResult.ok) {
          await supabase
            .from('registrations')
            .update({ verified_email_sent_at: sentAt, verified_email_error: null })
            .eq('id', payload.registrationId);
          return json({
            registration: {
              id: data.id,
              payment_status: data.payment_status,
              updated_at: data.updated_at,
              verified_email_sent_at: sentAt,
              verified_email_error: null,
            },
          });
        } else {
          await supabase
            .from('registrations')
            .update({ verified_email_error: emailResult.error })
            .eq('id', payload.registrationId);
          return json({
            registration: {
              id: data.id,
              payment_status: data.payment_status,
              updated_at: data.updated_at,
              verified_email_sent_at: null,
              verified_email_error: emailResult.error,
            },
          });
        }
      }
    }
  }

  return json({ registration: data });
}

async function createScreenshotUrl(supabase: ReturnType<typeof createClient>, payload: AdminPayload) {
  if (!payload.screenshotPath) {
    throw new Error('Screenshot path is required.');
  }

  const { data, error } = await supabase.storage
    .from('payment-screenshots')
    .createSignedUrl(payload.screenshotPath, 60 * 10);

  if (error) {
    throw new Error(error.message);
  }

  return json({ signedUrl: data.signedUrl });
}

function assertAdmin(req: Request) {
  const expected = requiredEnv('ADMIN_ACCESS_TOKEN');
  const received = req.headers.get('x-admin-token') || '';

  if (!received || received !== expected) {
    throw new Error('Unauthorized admin request.');
  }
}

function requiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

function getLead(registration: RegistrationRow) {
  return registration.participants.find((participant) => participant.role === 'lead');
}

async function sendVerifiedEmail(params: {
  apiKey: string;
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  to: string;
  leadName: string;
  teamName: string;
  teamSize: number;
  price: number;
  transactionId: string;
}) {
  if (!params.apiKey) {
    return { ok: false, error: 'BREVO_API_KEY is not configured.' };
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': params.apiKey,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: params.senderName,
        email: params.senderEmail,
      },
      replyTo: {
        email: params.replyToEmail,
        name: 'NIRMAAN 2K26 Support',
      },
      to: [
        {
          email: params.to,
          name: params.leadName,
        },
      ],
      subject: 'NIRMAAN 2K26 Payment Verified',
      htmlContent: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
          <h2>Your payment has been verified</h2>
          <p>Hi ${escapeHtml(params.leadName)},</p>
          <p>Your NIRMAAN 2K26 registration is now verified. Your team is confirmed.</p>
          <table style="border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:6px 12px;border:1px solid #e5e7eb"><strong>Team</strong></td><td style="padding:6px 12px;border:1px solid #e5e7eb">${escapeHtml(params.teamName)}</td></tr>
            <tr><td style="padding:6px 12px;border:1px solid #e5e7eb"><strong>Members</strong></td><td style="padding:6px 12px;border:1px solid #e5e7eb">${params.teamSize}</td></tr>
            <tr><td style="padding:6px 12px;border:1px solid #e5e7eb"><strong>Amount</strong></td><td style="padding:6px 12px;border:1px solid #e5e7eb">Rs. ${params.price}</td></tr>
            <tr><td style="padding:6px 12px;border:1px solid #e5e7eb"><strong>Transaction ID</strong></td><td style="padding:6px 12px;border:1px solid #e5e7eb">${escapeHtml(params.transactionId)}</td></tr>
          </table>
          <p>Keep this email handy for any future communication from the organizing team.</p>
          <p>Regards,<br>NIRMAAN 2K26 Team</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    return { ok: false, error: await response.text() };
  }

  return { ok: true, error: '' };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
