import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from 'lucide-react';
import { isAdmin } from '@/lib/supabase/server';

const adminNav = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin();
  if (!admin) redirect('/');

  return (
    <div className="flex min-h-screen bg-navy-900">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-gold/20 bg-navy-800 lg:block">
        <div className="flex h-16 items-center border-b border-gold/20 px-6">
          <Link href="/admin" className="font-display text-2xl text-gold">Admin</Link>
        </div>
        <nav className="p-4 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gold/70 hover:bg-gold/10 hover:text-gold transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 lg:ml-64">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
