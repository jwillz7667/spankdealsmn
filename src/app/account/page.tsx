import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, Heart, Settings, LogOut } from 'lucide-react';
import { getUser, getUserProfile } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';

export const metadata = { title: 'My Account' };

export default async function AccountPage() {
  const user = await getUser();
  if (!user) redirect('/login?redirect=/account');
  const profile = (await getUserProfile()) as Profile | null;

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <h1 className="font-display text-4xl text-gold mb-8">My Account</h1>
        
        <div className="bg-navy-800 rounded-lg border border-gold/20 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center">
              <User className="h-8 w-8 text-gold" />
            </div>
            <div>
              <h2 className="text-xl text-white font-semibold">
                {profile?.full_name || user.email || profile?.phone || 'User'}
              </h2>
              {(user.email || profile?.phone) && (
                <p className="text-gold/70">{user.email || profile?.phone}</p>
              )}
            </div>
          </div>
          {profile?.loyalty_points !== undefined && (
            <div className="mt-4 pt-4 border-t border-gold/20">
              <p className="text-gold/70 text-sm">Loyalty Points</p>
              <p className="text-2xl text-gold font-bold">{profile.loyalty_points}</p>
            </div>
          )}
        </div>

        <nav className="space-y-2">
          {[
            { icon: Package, label: 'My Orders', href: '/account/orders' },
            { icon: MapPin, label: 'Addresses', href: '/account/addresses' },
            { icon: Heart, label: 'Favorites', href: '/account/favorites' },
            { icon: Settings, label: 'Settings', href: '/account/settings' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 bg-navy-800 border border-gold/20 rounded-lg p-4 text-gold hover:bg-navy-700 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="w-full flex items-center gap-3 bg-navy-800 border border-gold/20 rounded-lg p-4 text-red-400 hover:bg-navy-700 transition-colors">
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </form>
        </nav>
      </div>
    </div>
  );
}
