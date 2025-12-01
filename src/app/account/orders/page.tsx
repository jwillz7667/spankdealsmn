import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';
import { formatCurrency, formatDateOnly, orderStatusLabels } from '@/lib/utils';

export const metadata = { title: 'My Orders' };

export default async function OrdersPage() {
  const user = await getUser();
  if (!user) redirect('/login?redirect=/account/orders');
  
  const supabase = await createServerSupabaseClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <Link href="/account" className="flex items-center gap-2 text-gold mb-6 hover:text-gold-400">
          <ArrowLeft className="h-4 w-4" /> Back to Account
        </Link>
        
        <h1 className="font-display text-4xl text-gold mb-8">My Orders</h1>
        
        {orders?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gold/70 mb-4">You haven't placed any orders yet.</p>
            <Link href="/products" className="btn-gold py-3 px-6">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-navy-800 border border-gold/20 rounded-lg p-4 hover:bg-navy-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-gold/50">{order.id.slice(0, 8)}...</span>
                  <span className="px-2 py-1 rounded bg-gold/20 text-gold text-xs">{orderStatusLabels[order.status]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gold/70 text-sm">{formatDateOnly(order.created_at)}</span>
                  <span className="text-white font-semibold">{formatCurrency(order.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
