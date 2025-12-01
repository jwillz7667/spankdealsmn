-- Waitlist entries for grand opening notifications
CREATE TABLE IF NOT EXISTS waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Allow anon inserts (for public waitlist form)
CREATE POLICY "Anon can join waitlist" ON waitlist_entries
  FOR INSERT TO anon
  WITH CHECK (true);

-- Service role full access
CREATE POLICY "Service role can manage waitlist" ON waitlist_entries
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_entries_phone_key ON waitlist_entries (phone);
