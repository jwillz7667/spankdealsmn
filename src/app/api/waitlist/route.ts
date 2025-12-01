import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

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

    const supabase = await createAdminSupabaseClient();
    const { data: entry, error } = await supabase
      .from('waitlist_entries')
      .upsert(
        {
          phone: parsed.data.phone.trim(),
          email: parsed.data.email,
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

    return NextResponse.json({ ok: true, entry });
  } catch (error) {
    console.error('Waitlist error', error);
    return NextResponse.json(
      { error: 'Unexpected error. Please try again.' },
      { status: 500 }
    );
  }
}
