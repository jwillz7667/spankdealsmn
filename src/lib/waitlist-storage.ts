/** Utility functions for waitlist storage backup operations */

import { createAdminSupabaseClient } from '@/lib/supabase/server';

export interface WaitlistEntry {
  id: string;
  phone: string;
  email: string | null;
  source: string | null;
  created_at: string;
}

/**
 * Convert waitlist entries to CSV format
 */
export function entriesToCSV(entries: WaitlistEntry[]): string {
  const headers = ['id', 'phone', 'email', 'source', 'created_at'];
  const rows = entries.map((entry) => [
    entry.id,
    entry.phone,
    entry.email || '',
    entry.source || '',
    entry.created_at,
  ]);

  const csvLines = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ];

  return csvLines.join('\n');
}

/**
 * Save a single phone entry to storage bucket as individual file
 */
export async function savePhoneToStorage(
  phone: string,
  email: string | null,
  source: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createAdminSupabaseClient();
    const timestamp = new Date().toISOString();
    const fileName = `entries/${timestamp}_${phone.replace(/\D/g, '')}.json`;

    const data = JSON.stringify(
      {
        phone,
        email,
        source,
        timestamp,
      },
      null,
      2
    );

    const { error } = await supabase.storage
      .from('waitlist-backups')
      .upload(fileName, data, {
        contentType: 'application/json',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('savePhoneToStorage error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Export all waitlist entries to storage as CSV
 */
export async function exportWaitlistToStorage(): Promise<{
  success: boolean;
  fileName?: string;
  error?: string;
}> {
  try {
    const supabase = await createAdminSupabaseClient();

    // Fetch all waitlist entries
    const { data: entries, error: fetchError } = await supabase
      .from('waitlist_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    if (!entries || entries.length === 0) {
      return { success: false, error: 'No entries to export' };
    }

    // Convert to CSV
    const csv = entriesToCSV(entries as WaitlistEntry[]);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `exports/waitlist_export_${timestamp}.csv`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('waitlist-backups')
      .upload(fileName, csv, {
        contentType: 'text/csv',
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    return { success: true, fileName };
  } catch (error) {
    console.error('exportWaitlistToStorage error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * List all backup files in storage
 */
export async function listBackups(): Promise<{
  success: boolean;
  files?: Array<{ name: string; created_at: string; size: number }>;
  error?: string;
}> {
  try {
    const supabase = await createAdminSupabaseClient();

    const { data, error } = await supabase.storage
      .from('waitlist-backups')
      .list('exports', {
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const files = data?.map((file) => ({
      name: file.name,
      created_at: file.created_at,
      size: file.metadata?.size || 0,
    }));

    return { success: true, files: files || [] };
  } catch (error) {
    console.error('listBackups error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get download URL for a backup file
 */
export async function getBackupDownloadUrl(
  fileName: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createAdminSupabaseClient();

    const { data, error } = await supabase.storage
      .from('waitlist-backups')
      .createSignedUrl(`exports/${fileName}`, 3600); // 1 hour expiry

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, url: data.signedUrl };
  } catch (error) {
    console.error('getBackupDownloadUrl error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
