// Edge function to send SMS updates to waitlist phone numbers.
// Requires secrets: SUPABASE_URL (auto), SUPABASE_SERVICE_ROLE_KEY (auto), TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

type Payload = {
  message?: string;
  phones?: string[];
};

const twilioConfig = {
  sid: Deno.env.get('TWILIO_ACCOUNT_SID') || '',
  token: Deno.env.get('TWILIO_AUTH_TOKEN') || '',
  from: Deno.env.get('TWILIO_FROM') || '',
};

function twilioHeaders() {
  const creds = btoa(`${twilioConfig.sid}:${twilioConfig.token}`);
  return {
    Authorization: `Basic ${creds}`,
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  };
}

async function sendSms(to: string, body: string) {
  if (!twilioConfig.sid || !twilioConfig.token || !twilioConfig.from) {
    throw new Error('Twilio env not configured');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioConfig.sid}/Messages.json`;
  const form = new URLSearchParams({ To: to, From: twilioConfig.from, Body: body });
  const res = await fetch(url, { method: 'POST', headers: twilioHeaders(), body: form });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twilio error: ${res.status} ${text}`);
  }
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response('Supabase env missing', { status: 500 });
  }

  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (!payload.message || payload.message.trim().length === 0) {
    return new Response('Message is required', { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const phones: string[] = [];

  if (Array.isArray(payload.phones) && payload.phones.length > 0) {
    phones.push(...payload.phones);
    // Upsert provided phones into waitlist for tracking.
    const upserts = payload.phones.map((phone) => ({
      phone,
      source: 'edge-function',
    }));
    await supabase.from('waitlist_entries').upsert(upserts, { onConflict: 'phone' });
  } else {
    const { data, error } = await supabase
      .from('waitlist_entries')
      .select('phone')
      .not('phone', 'is', null);
    if (error) {
      return new Response('Could not load waitlist', { status: 500 });
    }
    phones.push(...(data?.map((row) => row.phone) || []));
  }

  const uniquePhones = Array.from(new Set(phones.map((p) => p.trim()).filter(Boolean)));
  let sent = 0;
  const failed: { to: string; error: string }[] = [];

  for (const to of uniquePhones) {
    try {
      await sendSms(to, payload.message!);
      sent += 1;
    } catch (err) {
      failed.push({ to, error: (err as Error).message });
    }
  }

  return new Response(
    JSON.stringify({ ok: true, attempted: uniquePhones.length, sent, failed }),
    { status: failed.length ? 207 : 200, headers: { 'Content-Type': 'application/json' } }
  );
});
