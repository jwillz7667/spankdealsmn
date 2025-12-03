/** API endpoint for admins to download waitlist backup files */

import { NextResponse } from 'next/server';
import { getBackupDownloadUrl } from '@/lib/waitlist-storage';
import { isAdmin } from '@/lib/supabase/server';

/**
 * GET - Get signed download URL for a backup file
 */
export async function GET(request: Request) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');

    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    const result = await getBackupDownloadUrl(fileName);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate download URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, url: result.url });
  } catch (error) {
    console.error('Download backup error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download URL' },
      { status: 500 }
    );
  }
}
