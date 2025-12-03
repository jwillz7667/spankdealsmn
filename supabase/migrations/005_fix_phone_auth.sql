-- Fix phone authentication by making email nullable and updating trigger
-- This allows users to sign up with phone number only

-- Step 1: Make email nullable in profiles table
ALTER TABLE profiles
  ALTER COLUMN email DROP NOT NULL;

-- Step 2: Update the trigger function to handle phone-only signups
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_phone TEXT;
  user_name TEXT;
BEGIN
  -- Get email (may be null for phone-only signups)
  user_email := NEW.email;

  -- Get phone from metadata or from phone field
  user_phone := COALESCE(
    NEW.phone,
    NEW.raw_user_meta_data->>'phone'
  );

  -- Get full name from metadata, or use email/phone as fallback
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    user_email,
    user_phone,
    'User'
  );

  -- Insert profile record
  INSERT INTO public.profiles (id, email, full_name, phone, age_verified)
  VALUES (
    NEW.id,
    user_email,
    user_name,
    user_phone,
    COALESCE((NEW.raw_user_meta_data->>'age_verified')::boolean, FALSE)
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = COALESCE(EXCLUDED.email, profiles.email),
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    age_verified = COALESCE(EXCLUDED.age_verified, profiles.age_verified),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Add index on phone for phone-based lookups
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);

-- Step 4: Add constraint to ensure either email or phone exists
ALTER TABLE profiles
  ADD CONSTRAINT email_or_phone_required
  CHECK (email IS NOT NULL OR phone IS NOT NULL);

-- Step 5: Update the email unique constraint to allow nulls
-- Drop the old unique constraint if it exists
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_email_key;

-- Add a new unique constraint that allows multiple nulls
CREATE UNIQUE INDEX profiles_email_unique ON profiles (email) WHERE email IS NOT NULL;

COMMENT ON TABLE profiles IS 'User profiles - supports both email and phone authentication';
COMMENT ON COLUMN profiles.email IS 'User email address (nullable for phone-only accounts)';
COMMENT ON COLUMN profiles.phone IS 'User phone number (nullable for email-only accounts)';
