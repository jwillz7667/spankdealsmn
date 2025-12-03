# Fix Phone Authentication Issue

## Problem
Phone authentication is failing with error:
```
ERROR: null value in column "email" of relation "profiles" violates not-null constraint
```

This happens because the `profiles` table requires an email, but phone-only signups don't provide one.

## Solution
Run the database migration to make email nullable and update the trigger function.

---

## Option 1: Run via Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project (xtmktpltgfijvwvkgtql)

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and paste this SQL:**

```sql
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
```

4. **Run the query**
   - Click "Run" or press Ctrl+Enter (Cmd+Enter on Mac)
   - You should see "Success. No rows returned"

5. **Verify the changes**
   - Click "Table Editor" in sidebar
   - Select "profiles" table
   - Check that the schema now shows email as nullable

---

## Option 2: Run via Supabase CLI (If Configured)

```bash
# Apply the migration
pnpm db:migrate

# Or directly with Supabase CLI
npx supabase db push
```

**Note:** This may fail if your local Supabase CLI is not configured or has version mismatches.

---

## What This Migration Does

### 1. Makes Email Nullable
- Changes `email` column from `NOT NULL` to nullable
- Allows phone-only user accounts

### 2. Updates User Creation Trigger
- `handle_new_user()` function now handles phone-only signups
- Extracts phone from metadata or phone field
- Uses phone as fallback for display name
- Uses UPSERT to handle duplicate attempts

### 3. Adds Phone Index
- Creates index on `phone` column for faster lookups
- Improves performance for phone-based queries

### 4. Adds Email/Phone Constraint
- Ensures every user has either email OR phone (or both)
- Prevents completely empty profiles

### 5. Updates Email Uniqueness
- Allows multiple NULL emails
- Maintains uniqueness for non-null emails
- Supports both email and phone authentication

---

## Testing Phone Authentication

After running the migration:

1. **Go to your login page**
   - Navigate to http://localhost:3000/login (or production URL)

2. **Click "Phone" tab**

3. **Enter a phone number**
   - Format: (612) 555-1234 or +16125551234

4. **Click "Send Code"**
   - You should receive an SMS with a 6-digit code
   - Check your Twilio logs if not received

5. **Enter the verification code**

6. **Click "Verify & Sign In"**
   - Should sign you in successfully
   - Profile will be created with phone number, no email

---

## Verifying the Fix

### Check User Profile Creation

After phone signup, verify in Supabase Dashboard:

1. Go to **Authentication** > **Users**
2. Find the user who signed up with phone
3. Check:
   - ✅ User exists in auth.users
   - ✅ Phone number is set
   - ✅ Email is NULL or empty

4. Go to **Table Editor** > **profiles**
5. Find the user's profile record
6. Verify:
   - ✅ Profile exists
   - ✅ `email` is NULL
   - ✅ `phone` contains the user's phone number
   - ✅ `full_name` is set (may be phone number)
   - ✅ `age_verified` is FALSE (needs manual verification)

---

## Troubleshooting

### Migration Fails

**Error: "constraint already exists"**
- Safe to ignore - constraint is already in place
- Remove the specific constraint statement and re-run

**Error: "column email is still NOT NULL"**
- Check if there are existing profiles with NULL emails
- Run: `SELECT COUNT(*) FROM profiles WHERE email IS NULL;`
- If count > 0, the constraint can't be removed

### Phone Auth Still Failing

**Check Twilio Configuration:**
1. Supabase Dashboard > Authentication > Providers > Phone
2. Verify Twilio credentials are correct
3. Check Twilio console for SMS logs

**Check Phone Format:**
- Must be E.164 format: +1XXXXXXXXXX
- App auto-formats, but verify in logs

**Check Supabase Logs:**
1. Supabase Dashboard > Logs
2. Filter by "auth"
3. Look for OTP send/verify errors

---

## Rollback (If Needed)

If you need to rollback this migration:

```sql
-- WARNING: This will fail if there are phone-only users!
-- Delete phone-only profiles first if needed:
-- DELETE FROM profiles WHERE email IS NULL;

-- Revert email to NOT NULL
ALTER TABLE profiles
  ALTER COLUMN email SET NOT NULL;

-- Revert trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove phone index
DROP INDEX IF EXISTS idx_profiles_phone;

-- Remove constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS email_or_phone_required;

-- Restore original email unique constraint
DROP INDEX IF EXISTS profiles_email_unique;
ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
```

---

## Next Steps After Migration

1. ✅ Run the migration in Supabase Dashboard
2. ✅ Test phone authentication on login page
3. ✅ Verify profile creation in database
4. ✅ Test both email and phone signups
5. ✅ Update any admin queries that assume email exists
6. ✅ Update profile display logic to handle NULL emails

---

## Related Files

- **Migration File:** `supabase/migrations/005_fix_phone_auth.sql`
- **Login Page:** `src/app/login/page.tsx`
- **Signup Page:** `src/app/signup/page.tsx`
- **Auth Setup Guide:** `SUPABASE_AUTH_SETUP.md`

---

## Support

If you encounter issues:

1. Check Supabase logs (Dashboard > Logs)
2. Check browser console for errors
3. Verify Twilio credentials in Supabase
4. Check auth.users and profiles tables for data consistency
5. Review `SUPABASE_AUTH_SETUP.md` for configuration details

**For Production:**
- Test thoroughly in development first
- Have a rollback plan ready
- Monitor error rates after deployment
- Keep Twilio credits topped up for SMS delivery
