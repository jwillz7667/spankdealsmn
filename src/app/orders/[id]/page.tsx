import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check, MapPin, Clock, ArrowRight } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency, formatDateOnly, formatTimeSlot, orderStatusLabels } from '@/lib/utils';

interface OrderPageProps { params: Promise<{ id: string }>; }

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: order, error } = await supabase.from('orders').select('*, order_items(*, products(title, images))').eq('id', id).single();

  if (error || !order) notFound();

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
            <Check className="h-8 w-8 text-gold" />
          </div>
          <h1 className="font-display text-4xl text-gold">Order Confirmed!</h1>
          <p className="mt-2 text-gold/70">Thank you for your order. We'll have it to you soon.</p>
        </div>

        <div className="bg-navy-800 rounded-lg border border-gold/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gold/50 text-sm">Order ID</p>
              <p className="text-white font-mono text-sm">{order.id}</p>
            </div>
            <span className="px-3 py-1 rounded bg-gold/20 text-gold text-sm">{orderStatusLabels[order.status]}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 border-t border-gold/20 pt-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gold shrink-0" />
              <div>
                <p className="text-white font-medium">Delivery Address</p>
                <p className="text-gold/70 text-sm">{order.delivery_address.street}, {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.zip}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gold shrink-0" />
              <div>
                <p className="text-white font-medium">Delivery Time</p>
                <p className="text-gold/70 text-sm">{formatDateOnly(order.delivery_slot)}<br />{formatTimeSlot(order.delivery_slot)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-navy-800 rounded-lg border border-gold/20 p-6 mb-6">
          <h2 className="text-gold font-semibold mb-4">Order Items</h2>
          <ul className="space-y-2">
            {order.order_items.map((item: any) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-white">{item.product_title} × {item.quantity}</span>
                <span className="text-gold">{formatCurrency(item.price_at_purchase * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gold/20 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gold/70">Subtotal</span><span className="text-white">{formatCurrency(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gold/70">Tax</span><span className="text-white">{formatCurrency(order.tax)}</span></div>
            <div className="flex justify-between font-semibold pt-2 border-t border-gold/20"><span className="text-gold">Total</span><span className="text-gold">{formatCurrency(order.total)}</span></div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/products" className="btn-gold py-3 px-6 flex items-center justify-center gap-2">Continue Shopping <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/account/orders" className="btn-gold-outline py-3 px-6 text-center">View All Orders</Link>
        </div>
      </div>
    </div>
  );
}
