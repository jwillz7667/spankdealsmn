import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency, formatDateOnly, orderStatusLabels } from '@/lib/utils';

export const metadata = { title: 'Orders - Admin' };

export default async function AdminOrdersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: orders } = await supabase.from('orders').select('*, profiles(full_name, email)').order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl text-gold mb-8">Orders</h1>
      <div className="bg-navy-800 border border-gold/20 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gold/20 bg-navy-700">
            <tr>
              <th className="px-4 py-3 text-left text-gold">Order ID</th>
              <th className="px-4 py-3 text-left text-gold">Customer</th>
              <th className="px-4 py-3 text-left text-gold">Date</th>
              <th className="px-4 py-3 text-left text-gold">Status</th>
              <th className="px-4 py-3 text-right text-gold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {orders?.map((order: any) => (
              <tr key={order.id} className="hover:bg-navy-700/50">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="text-gold hover:text-gold-400 font-mono text-xs">{order.id.slice(0, 8)}...</Link>
                </td>
                <td className="px-4 py-3">
                  <div><span className="text-white">{order.profiles?.full_name || 'Guest'}</span></div>
                  <span className="text-gold/50 text-xs">{order.profiles?.email}</span>
                </td>
                <td className="px-4 py-3 text-gold/70">{formatDateOnly(order.created_at)}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded bg-gold/20 text-gold text-xs">{orderStatusLabels[order.status]}</span></td>
                <td className="px-4 py-3 text-right text-white font-medium">{formatCurrency(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
