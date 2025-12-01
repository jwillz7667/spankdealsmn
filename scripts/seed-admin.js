// Seed an admin user via Supabase service role.
// Usage: ADMIN_SEED_EMAIL=admin@example.com ADMIN_SEED_PASSWORD=SuperSecret123 pnpm seed:admin
// Reads .env.local or .env for Supabase keys if not already in process.env.

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnvFiles() {
  for (const filename of ['.env.local', '.env']) {
    const fullPath = path.join(process.cwd(), filename);
    if (!fs.existsSync(fullPath)) continue;
    const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

loadEnvFiles();

const required = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ADMIN_SEED_EMAIL: process.env.ADMIN_SEED_EMAIL,
  ADMIN_SEED_PASSWORD: process.env.ADMIN_SEED_PASSWORD,
};

const missing = Object.entries(required)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(', ')}`);
  console.error('Set them and re-run: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... ADMIN_SEED_EMAIL=... ADMIN_SEED_PASSWORD=... pnpm seed:admin');
  process.exit(1);
}

const supabase = createClient(required.NEXT_PUBLIC_SUPABASE_URL, required.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const email = required.ADMIN_SEED_EMAIL;
  const password = required.ADMIN_SEED_PASSWORD;
  const fullName = process.env.ADMIN_SEED_NAME || 'Admin User';
  const phone = process.env.ADMIN_SEED_PHONE || null;

  let userId = null;

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone },
  });

  if (!createError) {
    userId = created.user?.id;
    console.log(`Created auth user ${email}`);
  } else {
    if (createError.message?.toLowerCase().includes('registered') || createError.status === 422) {
      console.log(`Auth user ${email} already exists, looking up id...`);
      const { data: users, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (listError) {
        console.error('Failed to list users to find existing account:', listError.message);
        process.exit(1);
      }
      const match = users.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      userId = match?.id || null;
    } else {
      console.error('Failed to create auth user:', createError.message);
      process.exit(1);
    }
  }

  if (!userId) {
    console.error('No user ID available to seed profile.');
    process.exit(1);
  }

  // Ensure password and metadata are up to date even if user already existed.
  const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone },
  });

  if (updateError) {
    console.error('Failed to update auth user:', updateError.message);
    process.exit(1);
  }

  if (!userId) {
    console.error('No user ID available to seed profile.');
    process.exit(1);
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        email,
        full_name: fullName,
        phone,
        age_verified: true,
        role: 'admin',
      },
      { onConflict: 'id' }
    );

  if (profileError) {
    console.error('Failed to upsert profile:', profileError.message);
    process.exit(1);
  }

  console.log(`Admin profile ready for ${email}. You can sign in via /login with the provided password.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
