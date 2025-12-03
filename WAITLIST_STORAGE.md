# Waitlist Storage System

## Overview

The waitlist system has been enhanced to provide comprehensive data backup and storage capabilities using Supabase Storage buckets. All phone numbers submitted through the waitlist are now:

1. **Saved to Database** - Stored in `waitlist_entries` table (PostgreSQL)
2. **Backed up to Storage** - Individual JSON files saved to `waitlist-backups` bucket
3. **Exportable to CSV** - Admins can export all entries to CSV format
4. **SMS Confirmation** - Users receive thank you SMS upon signup

## Architecture

### Storage Bucket

- **Bucket Name**: `waitlist-backups`
- **Location**: Supabase Storage
- **File Types Allowed**: `text/csv`, `application/json`, `text/plain`
- **Size Limit**: 10MB per file
- **Access**: Admin-only (RLS policies enforced)

### Folder Structure

```
waitlist-backups/
├── entries/          # Individual phone number entries (JSON)
│   ├── 2025-01-15T10:30:00Z_6125551234.json
│   ├── 2025-01-15T11:45:00Z_6125559876.json
│   └── ...
└── exports/          # Full CSV exports
    ├── waitlist_export_2025-01-15T12-00-00Z.csv
    ├── waitlist_export_2025-01-16T08-30-00Z.csv
    └── ...
```

## Features

### 1. Automatic Individual Backups

Every time a user joins the waitlist, their information is automatically saved as a JSON file:

**File Format**: `entries/{timestamp}_{phone}.json`

**Content Example**:
```json
{
  "phone": "(612) 555-1234",
  "email": "user@example.com",
  "source": "web",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### 2. CSV Export

Admins can manually export all waitlist entries to CSV format via the admin dashboard.

**File Format**: `exports/waitlist_export_{timestamp}.csv`

**Columns**:
- `id` - Unique entry ID
- `phone` - Phone number
- `email` - Email address (if provided)
- `source` - Sign-up source (web, mobile, etc.)
- `created_at` - Timestamp of signup

### 3. SMS Confirmation

When a user joins the waitlist, they automatically receive:

```
Thanks for joining the DankDeals waitlist! 🎉 We'll text you when we launch. Reply STOP to opt out anytime.
```

### 4. Admin Dashboard

New "Storage Backups" section in `/admin/waitlist`:
- View all backup files
- See file creation date and size
- Download any backup file with one click
- Export new CSV with "Export to CSV" button

## API Endpoints

### POST `/api/waitlist`
**Public endpoint** - Join the waitlist

**Request Body**:
```json
{
  "phone": "(612) 555-1234",
  "email": "user@example.com"  // optional
}
```

**Response**:
```json
{
  "ok": true,
  "entry": {
    "id": "uuid",
    "phone": "(612) 555-1234",
    "email": "user@example.com",
    "source": "web",
    "created_at": "2025-01-15T10:30:00.000Z"
  }
}
```

**Side Effects**:
1. Saves to `waitlist_entries` table
2. Saves JSON file to `waitlist-backups/entries/`
3. Sends thank you SMS to user's phone

### POST `/api/admin/waitlist/export`
**Admin-only** - Export all waitlist entries to CSV

**Response**:
```json
{
  "ok": true,
  "fileName": "waitlist_export_2025-01-15T12-00-00Z.csv",
  "message": "Waitlist exported successfully"
}
```

### GET `/api/admin/waitlist/export`
**Admin-only** - List all backup files

**Response**:
```json
{
  "ok": true,
  "files": [
    {
      "name": "waitlist_export_2025-01-15T12-00-00Z.csv",
      "created_at": "2025-01-15T12:00:00.000Z",
      "size": 2048
    }
  ]
}
```

### GET `/api/admin/waitlist/download?file={filename}`
**Admin-only** - Get signed download URL for a backup file

**Query Parameters**:
- `file` - File name (without "exports/" prefix)

**Response**:
```json
{
  "ok": true,
  "url": "https://...supabase.co/storage/v1/object/sign/..."
}
```

## Database Migration

### 007_waitlist_storage.sql

Creates the `waitlist-backups` storage bucket with RLS policies:

- **Admins** - Full read/write access
- **Service Role** - Full access (for automated backups)
- **Public** - No access

Run this migration in Supabase Dashboard:
```bash
# Navigate to SQL Editor in Supabase Dashboard
# Copy and execute: supabase/migrations/007_waitlist_storage.sql
```

## Security

### Row Level Security (RLS)

All storage bucket operations are protected by RLS policies:

1. **Upload** - Only admins and service role
2. **Read** - Only admins (for downloads)
3. **Delete** - Only admins
4. **Service Role** - Full access for automated backups

### Data Privacy

- Phone numbers are stored in E.164 format (+1XXXXXXXXXX)
- Email addresses are optional and nullable
- All backups are private (not publicly accessible)
- Signed URLs expire after 1 hour

## Usage Guide

### For Admins

1. **View Backups**
   - Navigate to `/admin/waitlist`
   - Scroll to "Storage Backups" section
   - See all backup files with creation dates and sizes

2. **Export to CSV**
   - Click "Export to CSV" button in Storage Backups section
   - Wait for export to complete
   - New file will appear in the list automatically

3. **Download Backups**
   - Click "Download" button next to any backup file
   - File will open in new tab for download
   - Signed URL valid for 1 hour

### For Developers

**Import Storage Utilities**:
```typescript
import {
  savePhoneToStorage,
  exportWaitlistToStorage,
  listBackups,
  getBackupDownloadUrl,
  entriesToCSV
} from '@/lib/waitlist-storage';
```

**Save Individual Entry**:
```typescript
await savePhoneToStorage('+16125551234', 'user@example.com', 'web');
```

**Export All to CSV**:
```typescript
const result = await exportWaitlistToStorage();
if (result.success) {
  console.log(`Exported to: ${result.fileName}`);
}
```

**List All Backups**:
```typescript
const result = await listBackups();
if (result.success) {
  console.log(result.files);
}
```

**Get Download URL**:
```typescript
const result = await getBackupDownloadUrl('waitlist_export_2025-01-15.csv');
if (result.success) {
  window.open(result.url, '_blank');
}
```

## Error Handling

All storage operations are **non-blocking** and log errors without failing the main request:

```typescript
// Storage backup failure won't prevent user signup
savePhoneToStorage(phone, email, 'web').catch((err) => {
  console.error('Storage backup failed (non-critical):', err);
});
```

This ensures:
- User signups always succeed (even if storage fails)
- Database remains source of truth
- Storage is backup/export layer only

## Environment Variables

No additional environment variables required. Uses existing Supabase credentials:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

For SMS functionality:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

## Monitoring & Maintenance

### Check Storage Usage
```sql
-- View total storage size
SELECT
  bucket_id,
  COUNT(*) as file_count,
  SUM(metadata->>'size')::bigint as total_bytes
FROM storage.objects
WHERE bucket_id = 'waitlist-backups'
GROUP BY bucket_id;
```

### Clean Old Backups
```typescript
// Manually delete old exports (optional)
const supabase = await createAdminSupabaseClient();
await supabase.storage
  .from('waitlist-backups')
  .remove(['exports/old_file.csv']);
```

## Testing

### Test Waitlist Signup
```bash
curl -X POST https://dankdealsmn.com/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"phone":"6125551234","email":"test@example.com"}'
```

### Check Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Open `waitlist-backups` bucket
3. Verify `entries/` folder contains JSON files

### Test CSV Export
1. Login as admin
2. Navigate to `/admin/waitlist`
3. Click "Export to CSV"
4. Download and verify CSV contains all entries

## Troubleshooting

### Storage Upload Fails
- Check RLS policies are correctly configured
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check bucket file size limit (10MB)

### CSV Export is Empty
- Ensure `waitlist_entries` table has data
- Check admin user has correct `role: 'admin'`
- Verify RLS policies allow admin access

### SMS Not Sending
- Check Twilio credentials are configured
- Verify phone number is in E.164 format
- Check Twilio console for error logs

## Files Modified

1. **supabase/migrations/007_waitlist_storage.sql** - Storage bucket setup
2. **src/lib/waitlist-storage.ts** - Storage utility functions
3. **src/app/api/waitlist/route.ts** - Auto-save to storage + SMS
4. **src/app/api/admin/waitlist/export/route.ts** - Export/list endpoints
5. **src/app/api/admin/waitlist/download/route.ts** - Download endpoint
6. **src/app/admin/waitlist/page.tsx** - Admin UI enhancements

## Future Enhancements

- [ ] Automated daily CSV exports
- [ ] Webhook notifications on new signups
- [ ] Analytics dashboard (signups over time)
- [ ] Duplicate phone number detection UI
- [ ] Bulk delete old backups (retention policy)
