import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

type PlanKey = 'duo' | 'trio' | 'squad';

type ParticipantInput = {
  fullName: string;
  email: string;
  whatsapp: string;
  gender: string;
  college: string;
  stream: string;
  year: string;
};

type RegistrationPayload = {
  teamName: string;
  plan: PlanKey;
  teamSize: number;
  price: number;
  lead: ParticipantInput;
  members: ParticipantInput[];
  transactionId: string;
  screenshot: {
    fileName: string;
    contentType: string;
    base64: string;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const plans: Record<PlanKey, { size: number; price: number; label: string }> = {
  duo: { size: 2, price: 699, label: 'Duo' },
  trio: { size: 3, price: 999, label: 'Trio' },
  squad: { size: 4, price: 1249, label: 'Squad' },
};

const emailPattern = /^\S+@\S+\.\S+$/;
const allowedContentTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const payload = await req.json() as RegistrationPayload;
    const clean = validateAndNormalize(payload);

    const supabaseUrl = requiredEnv('SUPABASE_URL');
    const serviceRoleKey = requiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const emailFrom = Deno.env.get('CONFIRMATION_EMAIL_FROM') || 'NIRMAAN 2K26 <onboarding@resend.dev>';

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const duplicate = await findDuplicate(supabase, clean);
    if (duplicate) {
      return json({ error: duplicate }, 409);
    }

    const screenshotBytes = decodeBase64(clean.screenshot.base64);
    const extension = extensionFromContentType(clean.screenshot.contentType);
    const screenshotPath = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-screenshots')
      .upload(screenshotPath, screenshotBytes, {
        contentType: clean.screenshot.contentType,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Screenshot upload failed: ${uploadError.message}`);
    }

    const { data: registration, error: registrationError } = await supabase
      .from('registrations')
      .insert({
        team_name: clean.teamName,
        team_name_normalized: clean.teamNameNormalized,
        plan: clean.plan,
        team_size: clean.teamSize,
        price: clean.price,
        transaction_id: clean.transactionId,
        transaction_id_normalized: clean.transactionIdNormalized,
        screenshot_path: screenshotPath,
        payment_status: 'pending',
      })
      .select('id')
      .single();

    if (registrationError || !registration) {
      await supabase.storage.from('payment-screenshots').remove([screenshotPath]);
      return json({ error: messageForDatabaseError(registrationError?.message) }, 409);
    }

    const participants = [
      {
        registration_id: registration.id,
        role: 'lead',
        full_name: clean.lead.fullName,
        email: clean.lead.email,
        email_normalized: clean.lead.emailNormalized,
        whatsapp: clean.lead.whatsapp,
        gender: clean.lead.gender,
        college: clean.lead.college,
        stream: clean.lead.stream,
        year: clean.lead.year,
      },
      ...clean.members.map((member) => ({
        registration_id: registration.id,
        role: 'member',
        full_name: member.fullName,
        email: member.email,
        email_normalized: member.emailNormalized,
        whatsapp: member.whatsapp,
        gender: member.gender,
        college: member.college,
        stream: member.stream,
        year: member.year,
      })),
    ];

    const { error: participantsError } = await supabase
      .from('participants')
      .insert(participants);

    if (participantsError) {
      await supabase.from('registrations').delete().eq('id', registration.id);
      await supabase.storage.from('payment-screenshots').remove([screenshotPath]);
      return json({ error: messageForDatabaseError(participantsError.message) }, 409);
    }

    if (resendApiKey) {
      await sendConfirmationEmail({
        apiKey: resendApiKey,
        from: emailFrom,
        to: clean.lead.email,
        leadName: clean.lead.fullName,
        teamName: clean.teamName,
        planLabel: plans[clean.plan].label,
        teamSize: clean.teamSize,
        price: clean.price,
        transactionId: clean.transactionId,
      });
    }

    return json({
      registrationId: registration.id,
      emailSent: Boolean(resendApiKey),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
    return json({ error: message }, 400);
  }
});

function validateAndNormalize(payload: RegistrationPayload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid registration data.');
  }

  const plan = payload.plan;
  if (!plans[plan]) {
    throw new Error('Invalid team plan selected.');
  }

  const expected = plans[plan];
  if (payload.teamSize !== expected.size || payload.price !== expected.price) {
    throw new Error('Selected plan amount does not match.');
  }

  const teamName = requiredText(payload.teamName, 'Team name');
  const transactionId = requiredText(payload.transactionId, 'Transaction ID');
  const lead = normalizeParticipant(payload.lead, 'Team lead');
  const members = (payload.members || []).map((member, index) =>
    normalizeParticipant(member, `Member ${index + 2}`)
  );

  if (members.length !== expected.size - 1) {
    throw new Error(`Please enter exactly ${expected.size - 1} team member details.`);
  }

  const emails = [lead.emailNormalized, ...members.map((member) => member.emailNormalized)];
  if (new Set(emails).size !== emails.length) {
    throw new Error('Each participant must use a different email address.');
  }

  if (!payload.screenshot?.base64 || !payload.screenshot?.contentType) {
    throw new Error('Payment screenshot is required.');
  }

  if (!allowedContentTypes.has(payload.screenshot.contentType)) {
    throw new Error('Payment screenshot must be PNG, JPG, JPEG, or WEBP.');
  }

  return {
    teamName,
    teamNameNormalized: normalizeKey(teamName),
    plan,
    teamSize: expected.size,
    price: expected.price,
    lead,
    members,
    transactionId,
    transactionIdNormalized: normalizeKey(transactionId),
    screenshot: payload.screenshot,
  };
}

function normalizeParticipant(participant: ParticipantInput, label: string) {
  if (!participant || typeof participant !== 'object') {
    throw new Error(`${label} details are required.`);
  }

  const fullName = requiredText(participant.fullName, `${label} full name`);
  const email = requiredText(participant.email, `${label} email`).toLowerCase();
  const whatsapp = requiredText(participant.whatsapp, `${label} WhatsApp number`).replace(/\D/g, '');

  if (!emailPattern.test(email)) {
    throw new Error(`${label} email is invalid.`);
  }

  if (!/^\d{10}$/.test(whatsapp)) {
    throw new Error(`${label} WhatsApp number must be 10 digits.`);
  }

  return {
    fullName,
    email,
    emailNormalized: email,
    whatsapp,
    gender: requiredText(participant.gender, `${label} gender`),
    college: requiredText(participant.college, `${label} college`),
    stream: requiredText(participant.stream, `${label} stream`),
    year: requiredText(participant.year, `${label} year`),
  };
}

async function findDuplicate(supabase: ReturnType<typeof createClient>, clean: ReturnType<typeof validateAndNormalize>) {
  const { data: existingTeam } = await supabase
    .from('registrations')
    .select('id')
    .eq('team_name_normalized', clean.teamNameNormalized)
    .maybeSingle();

  if (existingTeam) {
    return 'This team name is already registered.';
  }

  const { data: existingTransaction } = await supabase
    .from('registrations')
    .select('id')
    .eq('transaction_id_normalized', clean.transactionIdNormalized)
    .maybeSingle();

  if (existingTransaction) {
    return 'This transaction ID has already been submitted.';
  }

  const emails = [clean.lead.emailNormalized, ...clean.members.map((member) => member.emailNormalized)];
  const { data: existingEmails } = await supabase
    .from('participants')
    .select('email')
    .in('email_normalized', emails)
    .limit(1);

  if (existingEmails?.length) {
    return 'One of these email addresses is already registered.';
  }

  return null;
}

async function sendConfirmationEmail(params: {
  apiKey: string;
  from: string;
  to: string;
  leadName: string;
  teamName: string;
  planLabel: string;
  teamSize: number;
  price: number;
  transactionId: string;
}) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: params.from,
      to: params.to,
      subject: 'NIRMAAN 2K26 Registration Received',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
          <h2>NIRMAAN 2K26 Registration Received</h2>
          <p>Hi ${escapeHtml(params.leadName)},</p>
          <p>Your team registration has been received. Payment verification is currently pending.</p>
          <table style="border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:6px 12px;border:1px solid #e5e7eb"><strong>Team</strong></td><td style="padding:6px 12px;border:1px solid #e5e7eb">${escapeHtml(params.teamName)}</td></tr>
            <tr><td style="padding:6px 12px;border:1px solid #e5e7eb"><strong>Plan</strong></td><td style="padding:6px 12px;border:1px solid #e5e7eb">${params.planLabel} (${params.teamSize} members)</td></tr>
            <tr><td style="padding:6px 12px;border:1px solid #e5e7eb"><strong>Amount</strong></td><td style="padding:6px 12px;border:1px solid #e5e7eb">Rs. ${params.price}</td></tr>
            <tr><td style="padding:6px 12px;border:1px solid #e5e7eb"><strong>Transaction ID</strong></td><td style="padding:6px 12px;border:1px solid #e5e7eb">${escapeHtml(params.transactionId)}</td></tr>
          </table>
          <p>We will verify your payment and contact you if anything else is needed.</p>
          <p>Regards,<br>NIRMAAN 2K26 Team</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    console.error('Resend email failed', await response.text());
  }
}

function requiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

function requiredText(value: unknown, label: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} is required.`);
  }
  return value.trim();
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function decodeBase64(base64: string) {
  const normalized = base64.includes(',') ? base64.split(',').pop() || '' : base64;
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function extensionFromContentType(contentType: string) {
  if (contentType === 'image/png') return 'png';
  if (contentType === 'image/webp') return 'webp';
  return 'jpg';
}

function messageForDatabaseError(message = '') {
  if (message.includes('registrations_team_name_unique')) {
    return 'This team name is already registered.';
  }
  if (message.includes('registrations_transaction_id_unique')) {
    return 'This transaction ID has already been submitted.';
  }
  if (message.includes('participants_email_unique')) {
    return 'One of these email addresses is already registered.';
  }
  return message || 'Registration failed. Please try again.';
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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
