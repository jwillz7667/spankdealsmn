-- Create storage bucket for waitlist backups
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'waitlist-backups',
  'waitlist-backups',
  false,
  10485760, -- 10MB limit
  ARRAY['text/csv', 'application/json', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for waitlist-backups bucket
-- Only admins can upload/read/delete
CREATE POLICY "Admins can upload waitlist backups" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'waitlist-backups' AND
    auth.jwt() ->> 'role' = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can read waitlist backups" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'waitlist-backups' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete waitlist backups" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'waitlist-backups' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Service role full access for automated backups
CREATE POLICY "Service role can manage waitlist backups" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'waitlist-backups')
  WITH CHECK (bucket_id = 'waitlist-backups');
