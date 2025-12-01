import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Allowed redirect paths after authentication.
 * Prevents open redirect attacks by whitelisting safe destinations.
 */
const ALLOWED_REDIRECTS = [
  '/',
  '/products',
  '/checkout',
  '/account',
  '/account/orders',
  '/account/addresses',
  '/account/favorites',
  '/menu',
  '/admin',
];

/**
 * Validates redirect path against whitelist.
 * Returns safe path or default '/' if invalid.
 */
function getSafeRedirectPath(redirect: string | null): string {
  if (!redirect) return '/';

  // Normalize path (remove query strings, trailing slashes)
  const pathWithoutQuery = redirect.split('?')[0] || '/';
  const normalizedPath = pathWithoutQuery.replace(/\/$/, '') || '/';

  // Check exact match first
  if (ALLOWED_REDIRECTS.includes(normalizedPath)) {
    return redirect; // Return original with query params preserved
  }

  // Check if path starts with allowed prefix (for dynamic routes like /products/flower)
  const isAllowedPrefix = ALLOWED_REDIRECTS.some(
    (allowed) => normalizedPath.startsWith(allowed + '/') || normalizedPath === allowed
  );

  if (isAllowedPrefix) {
    return redirect;
  }

  // Invalid redirect - return home
  return '/';
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirect = requestUrl.searchParams.get('redirect');

  if (code) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  const safeRedirect = getSafeRedirectPath(redirect);
  return NextResponse.redirect(new URL(safeRedirect, requestUrl.origin));
}
