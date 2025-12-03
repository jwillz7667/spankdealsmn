# FIX GOOGLE OAUTH - DO THIS NOW

## The Problem
OAuth is giving "requested path is invalid" or failing silently.

## The Fix (5 Minutes)

### Step 1: Configure Supabase (REQUIRED)

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select project: `xtmktpltgfijvwvkgtql`

2. **Configure Redirect URLs**
   - Click **Authentication** → **URL Configuration**
   - Set **Site URL**: `http://localhost:3000`
   - Add these **Redirect URLs** (click "+ Add URL" for each):
     ```
     http://localhost:3000/auth/callback
     http://localhost:3000/*
     https://dankdealsmn.com/auth/callback
     https://dankdealsmn.com/*
     ```
   - Click **Save**

3. **Enable Google Provider**
   - Click **Authentication** → **Providers**
   - Find **Google** in the list
   - Toggle it **ON** (enabled)
   - Enter these credentials:
     - **Client ID**: `1081726449541-85jrs34e642crdh6hc4m3opljdcfh017.apps.googleusercontent.com`
     - **Client Secret**: `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`
   - **Redirect URL** (copy this):
     ```
     https://xtmktpltgfijvwvkgtql.supabase.co/auth/v1/callback
     ```
   - Click **Save**

### Step 2: Configure Google Cloud Console

1. **Go to Google Cloud Console**
   - https://console.cloud.google.com/apis/credentials
   - Select your project (or create one)

2. **Find your OAuth Client**
   - Look for Client ID: `1081726449541-85jrs34e642crdh6hc4m3opljdcfh017`
   - Click on it to edit

3. **Add Authorized Redirect URIs**
   - Under "Authorized redirect URIs", add ALL of these:
     ```
     https://xtmktpltgfijvwvkgtql.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     https://dankdealsmn.com/auth/callback
     ```
   - Click **Save**

### Step 3: Test It

1. Go to http://localhost:3000/login
2. Click "Continue with Google"
3. Should redirect to Google sign-in
4. After signing in, should redirect back to your app

---

## If It Still Doesn't Work

### Check Supabase Logs
1. Supabase Dashboard → Logs
2. Look for auth errors

### Check Browser Console
1. Open DevTools (F12)
2. Look for errors when clicking Google button

### Verify URLs Match Exactly
- Supabase redirect URL: `https://xtmktpltgfijvwvkgtql.supabase.co/auth/v1/callback`
- This MUST be in Google Cloud Console authorized redirect URIs

---

## Common Errors

**"redirect_uri_mismatch"**
- Google Cloud Console doesn't have the Supabase callback URL
- Add: `https://xtmktpltgfijvwvkgtql.supabase.co/auth/v1/callback`

**"requested path is invalid"**
- Supabase doesn't have your app URL in redirect URLs
- Add: `http://localhost:3000/auth/callback` and `http://localhost:3000/*`

**Nothing happens when clicking Google button**
- Check browser console for errors
- Google provider might not be enabled in Supabase
- Check that credentials are entered correctly

---

## Quick Checklist

In **Supabase Dashboard**:
- [ ] Site URL set to `http://localhost:3000`
- [ ] Redirect URLs include `http://localhost:3000/auth/callback`
- [ ] Redirect URLs include `http://localhost:3000/*`
- [ ] Google provider is **enabled**
- [ ] Google Client ID is entered
- [ ] Google Client Secret is entered

In **Google Cloud Console**:
- [ ] Authorized redirect URIs include `https://xtmktpltgfijvwvkgtql.supabase.co/auth/v1/callback`
- [ ] Authorized redirect URIs include `http://localhost:3000/auth/callback`
- [ ] OAuth consent screen is configured
- [ ] OAuth client status is "Active"

---

## Still Broken?

Run this in your browser console on the login page:

```javascript
// Test OAuth configuration
const supabase = window.Supabase?.createClient(
  'https://xtmktpltgfijvwvkgtql.supabase.co',
  'your_anon_key'
);

supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
}).then(({ data, error }) => {
  console.log('OAuth Result:', { data, error });
});
```

Check the console output for specific error messages.
