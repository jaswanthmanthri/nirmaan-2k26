import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

type AdminAction = 'list' | 'updateStatus' | 'screenshotUrl';
type PaymentStatus = 'pending' | 'verified' | 'rejected';

type AdminPayload = {
  action: AdminAction;
  registrationId?: string;
  status?: PaymentStatus;
  screenshotPath?: string;
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
      participants (
        id,
        role,
        full_name,
        email,
        whatsapp,
        gender,
        college,
        stream,
        year,
        created_at
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return json({ registrations: data ?? [] });
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
    .select('id, payment_status, updated_at')
    .single();

  if (error) {
    throw new Error(error.message);
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
