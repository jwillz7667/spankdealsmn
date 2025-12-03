/** API endpoint for admins to export waitlist to storage bucket */

import { NextResponse } from 'next/server';
import { exportWaitlistToStorage, listBackups } from '@/lib/waitlist-storage';
import { isAdmin } from '@/lib/supabase/server';

/**
 * GET - List all backup files
 */
export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const result = await listBackups();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to list backups' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, files: result.files });
  } catch (error) {
    console.error('List backups error:', error);
    return NextResponse.json(
      { error: 'Failed to list backups' },
      { status: 500 }
    );
  }
}

/**
 * POST - Export waitlist to storage bucket
 */
export async function POST() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const result = await exportWaitlistToStorage();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Export failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      fileName: result.fileName,
      message: 'Waitlist exported successfully',
    });
  } catch (error) {
    console.error('Export waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to export waitlist' },
      { status: 500 }
    );
  }
}
