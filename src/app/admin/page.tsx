import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

export const metadata = { title: 'Admin Dashboard' };

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  const [{ count: productCount }, { count: orderCount }, { count: customerCount }, { data: recentOrders }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('orders').select('total').order('created_at', { ascending: false }).limit(30),
  ]);

  const totalRevenue = recentOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

  const stats = [
    { label: 'Products', value: productCount || 0, icon: Package, color: 'text-blue-400' },
    { label: 'Orders', value: orderCount || 0, icon: ShoppingCart, color: 'text-green-400' },
    { label: 'Customers', value: customerCount || 0, icon: Users, color: 'text-purple-400' },
    { label: 'Revenue (30d)', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-gold' },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-gold mb-8">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-navy-800 border border-gold/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-gold/70 text-sm">{stat.label}</span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
