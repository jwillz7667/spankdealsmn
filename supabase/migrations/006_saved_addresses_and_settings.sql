-- Add saved addresses and user settings support
-- Allows users to save multiple addresses and manage account preferences

-- Create saved_addresses table
CREATE TABLE IF NOT EXISTS saved_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL, -- e.g., "Home", "Work", "Mom's House"
  street TEXT NOT NULL,
  apt TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'MN',
  zip TEXT NOT NULL,
  delivery_instructions TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_zip CHECK (zip ~ '^\d{5}(-\d{4})?$')
);

-- Add indexes
CREATE INDEX idx_saved_addresses_user_id ON saved_addresses(user_id);
CREATE INDEX idx_saved_addresses_default ON saved_addresses(user_id, is_default) WHERE is_default = TRUE;

-- Enable RLS
ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for saved_addresses
CREATE POLICY "Users can view own addresses"
  ON saved_addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
  ON saved_addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON saved_addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON saved_addresses FOR DELETE
  USING (auth.uid() = user_id);

-- Add notification preferences to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS notification_email BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notification_sms BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS marketing_emails BOOLEAN DEFAULT FALSE;

-- Function to ensure only one default address per user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting this address as default, unset all other defaults for this user
  IF NEW.is_default = TRUE THEN
    UPDATE saved_addresses
    SET is_default = FALSE
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_default = TRUE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain single default address
CREATE TRIGGER ensure_single_default_address_trigger
  BEFORE INSERT OR UPDATE ON saved_addresses
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_address();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_saved_addresses_updated_at
  BEFORE UPDATE ON saved_addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Also add trigger to profiles table if not exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE saved_addresses IS 'User saved delivery addresses with labels';
COMMENT ON COLUMN saved_addresses.label IS 'User-friendly label like "Home" or "Work"';
COMMENT ON COLUMN saved_addresses.is_default IS 'Default address for deliveries (only one per user)';
COMMENT ON COLUMN profiles.notification_email IS 'Receive email notifications for orders';
COMMENT ON COLUMN profiles.notification_sms IS 'Receive SMS notifications for orders';
COMMENT ON COLUMN profiles.marketing_emails IS 'Receive marketing and promotional emails';
