# Supabase Authentication Setup Guide

This guide will help you configure Google OAuth and Phone (SMS) authentication in Supabase.

## Table of Contents
- [OAuth Setup (Google)](#oauth-setup-google)
- [Phone Authentication Setup](#phone-authentication-setup)
- [Testing Authentication](#testing-authentication)

## OAuth Setup (Google)

### 1. Configure Google OAuth Provider in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Google** in the list and enable it
4. Enter your Google OAuth credentials:
   - **Client ID**: `1081726449541-85jrs34e642crdh6hc4m3opljdcfh017.apps.googleusercontent.com`
   - **Client Secret**: `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`
5. Click **Save**

### 2. Configure Redirect URLs

In Supabase **Authentication** > **URL Configuration**, add the following URLs:

**Site URL:**
```
https://dankdealsmn.com
```

**Redirect URLs (add all of these):**
```
http://localhost:3000/auth/callback
https://dankdealsmn.com/auth/callback
```

### 3. Google Cloud Console Configuration

If you need to create new OAuth credentials or update existing ones:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Click on your OAuth 2.0 Client ID or create a new one
4. Add these **Authorized redirect URIs**:
   ```
   https://xtmktpltgfijvwvkgtql.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   https://dankdealsmn.com/auth/callback
   ```
5. Save the changes

## Phone Authentication Setup

### 1. Enable Phone Provider in Supabase

1. Go to **Authentication** > **Providers**
2. Find **Phone** and toggle it **ON**
3. You'll see options for SMS provider configuration

### 2. Configure Twilio for SMS

Supabase uses Twilio for sending SMS OTP codes. You have two options:

#### Option A: Use Your Own Twilio Account (Recommended for Production)

1. In Supabase **Authentication** > **Providers** > **Phone**
2. Select **Twilio** as the SMS provider
3. Enter your Twilio credentials from .env.local:
   - **Account SID**: (from TWILIO_ACCOUNT_SID)
   - **Auth Token**: (from TWILIO_AUTH_TOKEN)
   - **Messaging Service SID** or **Phone Number**: (from TWILIO_PHONE_NUMBER)
4. Click **Save**

#### Option B: Use Supabase's Built-in Twilio (Development Only)

For development, you can use Supabase's default Twilio integration, but it has rate limits and is not recommended for production.

### 3. Configure Phone Authentication Settings

1. In **Authentication** > **Settings**
2. Under **Phone Auth**:
   - Enable **Confirm phone number**
   - Set **OTP expiry**: 60 seconds (default)
   - Set **OTP length**: 6 digits (default)

### 4. Test Phone Numbers (Development)

For development/testing without sending real SMS:

1. Go to **Authentication** > **Providers** > **Phone**
2. Add test phone numbers in the **Test phone numbers** section:
   ```
   +11234567890: 123456
   ```
   This allows you to use the fixed code `123456` for the test number `+11234567890`.

## Environment Variables

Ensure your `.env.local` has the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xtmktpltgfijvwvkgtql.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google OAuth
GOOGLE_CLIENT_ID=1081726449541-85jrs34e642crdh6hc4m3opljdcfh017.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Twilio (for phone auth)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## Testing Authentication

### Test Google OAuth

1. Start your development server: `pnpm dev`
2. Navigate to `http://localhost:3000/login`
3. Click **Continue with Google**
4. You should be redirected to Google's OAuth consent screen
5. After authorizing, you'll be redirected back to your app

**Common Issues:**
- **"requested path is invalid"**: The redirect URL isn't whitelisted in Supabase. Double-check Step 2 above.
- **"redirect_uri_mismatch"**: The Google Cloud Console doesn't have the correct redirect URIs. Check Step 3.

### Test Phone Authentication

1. Navigate to `http://localhost:3000/login`
2. Click the **Phone** tab
3. Enter a phone number in the format: `(612) 555-1234`
4. Click **Send Code**
5. Check your phone for the 6-digit OTP code
6. Enter the code and click **Verify & Sign In**

**Common Issues:**
- **"SMS sending failed"**: Check that Twilio credentials are correct in Supabase
- **"Invalid phone number"**: Ensure the number is in a valid US format
- **"OTP expired"**: Request a new code (codes expire after 60 seconds)

### Test with Development Phone Numbers

For testing without using real phone numbers:

1. Add test numbers in Supabase (see "Test Phone Numbers" above)
2. Use the test number when signing in
3. Use the fixed code you configured (e.g., `123456`)

## Profile Creation on First OAuth Login

When a user signs in with OAuth for the first time, their profile is automatically created via the `handle_new_user()` database function. This function is triggered on auth signup and creates a corresponding entry in the `profiles` table.

If you need to manually ensure profile creation for OAuth users:

1. Check if a profile exists:
   ```sql
   SELECT * FROM profiles WHERE id = 'user_id';
   ```

2. If not, create one:
   ```sql
   INSERT INTO profiles (id, email, full_name)
   VALUES ('user_id', 'user@example.com', 'User Name');
   ```

## Production Checklist

Before deploying to production:

- [ ] Configure production redirect URLs in Supabase
- [ ] Update Google OAuth redirect URIs to include production domain
- [ ] Configure Twilio with production credentials (not test mode)
- [ ] Remove test phone numbers from Supabase
- [ ] Set up email confirmations (if required)
- [ ] Configure rate limiting for auth endpoints
- [ ] Test all authentication flows in production environment

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase OAuth Guide](https://supabase.com/docs/guides/auth/social-login)
- [Supabase Phone Auth Guide](https://supabase.com/docs/guides/auth/phone-login)
- [Twilio Console](https://console.twilio.com/)
