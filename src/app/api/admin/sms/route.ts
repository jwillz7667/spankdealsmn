import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { sendBulkSMS } from '@/lib/twilio';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { message, recipients } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (message.length > 1600) {
      return NextResponse.json(
        { error: 'Message too long (max 1600 characters)' },
        { status: 400 }
      );
    }

    // If recipients is 'all', fetch all waitlist phone numbers
    let phoneNumbers: string[] = [];

    if (recipients === 'all') {
      const { data: waitlistEntries, error } = await supabase
        .from('waitlist_entries')
        .select('phone')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch waitlist entries:', error);
        return NextResponse.json(
          { error: 'Failed to fetch waitlist entries' },
          { status: 500 }
        );
      }

      phoneNumbers = waitlistEntries.map((entry) => entry.phone);
    } else if (Array.isArray(recipients)) {
      phoneNumbers = recipients;
    } else {
      return NextResponse.json(
        { error: 'Invalid recipients. Use "all" or provide an array of phone numbers' },
        { status: 400 }
      );
    }

    if (phoneNumbers.length === 0) {
      return NextResponse.json({ error: 'No recipients found' }, { status: 400 });
    }

    // Send SMS
    const results = await sendBulkSMS(phoneNumbers, message);

    return NextResponse.json({
      success: true,
      results,
      message: `Sent to ${results.successful} of ${results.total} recipients`,
    });
  } catch (error) {
    console.error('SMS send error:', error);
    return NextResponse.json(
      { error: 'Failed to send SMS' },
      { status: 500 }
    );
  }
}

// Get waitlist stats
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get waitlist entries
    const { data: entries, error } = await supabase
      .from('waitlist_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch waitlist entries:', error);
      return NextResponse.json(
        { error: 'Failed to fetch waitlist entries' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      total: entries.length,
      entries,
    });
  } catch (error) {
    console.error('Failed to fetch waitlist:', error);
    return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
  }
}
