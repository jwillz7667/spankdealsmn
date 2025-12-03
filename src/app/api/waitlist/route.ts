import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { savePhoneToStorage } from '@/lib/waitlist-storage';
import { sendSMS } from '@/lib/twilio';

const waitlistSchema = z.object({
  phone: z
    .string()
    .min(7, 'Phone is required')
    .max(32, 'Phone is too long'),
  email: z
    .string()
    .email()
    .optional()
    .or(z.literal(''))
    .transform((val) => (val ? val : null)),
});

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = waitlistSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const phone = parsed.data.phone.trim();
    const email = parsed.data.email;

    // Save to database
    const supabase = await createAdminSupabaseClient();
    const { data: entry, error } = await supabase
      .from('waitlist_entries')
      .upsert(
        {
          phone,
          email,
          source: 'web',
        },
        { onConflict: 'phone' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Could not save your info. Please try again.' },
        { status: 500 }
      );
    }

    // Also save to storage bucket for backup (non-blocking)
    savePhoneToStorage(phone, email, 'web').catch((err) => {
      console.error('Storage backup failed (non-critical):', err);
    });

    // Send thank you SMS (non-blocking)
    sendSMS({
      to: phone,
      message:
        "Thanks for joining the DankDeals waitlist! 🎉 We'll text you when we launch. Reply STOP to opt out anytime.",
    }).catch((err) => {
      console.error('Thank you SMS failed (non-critical):', err);
    });

    return NextResponse.json({ ok: true, entry });
  } catch (error) {
    console.error('Waitlist error', error);
    return NextResponse.json(
      { error: 'Unexpected error. Please try again.' },
      { status: 500 }
    );
  }
}
