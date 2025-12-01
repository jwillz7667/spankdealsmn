import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { subDays, format, startOfDay, eachDayOfInterval } from 'date-fns';
import { AdminAnalyticsCharts } from '@/components/admin/AdminAnalyticsCharts';

export const metadata = { title: 'Admin Dashboard' };

interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  id: string;
  title: string;
  total_sold: number;
  total_revenue: number;
}

interface OrderStatusCount {
  status: string;
  count: number;
}

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
  const sevenDaysAgo = subDays(new Date(), 7).toISOString();

  // Fetch all data in parallel
  const [
    { count: productCount },
    { count: orderCount },
    { count: customerCount },
    { data: ordersLast30Days },
    { data: ordersLast7Days },
    { data: orderItems },
    { data: recentOrders },
    { data: lowStockProducts },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase
      .from('orders')
      .select('id, total, status, created_at')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: true }),
    supabase
      .from('orders')
      .select('id, total')
      .gte('created_at', sevenDaysAgo),
    supabase
      .from('order_items')
      .select('product_id, quantity, price_at_purchase, product_title')
      .gte('created_at', thirtyDaysAgo),
    supabase
      .from('orders')
      .select('id, status, total, created_at, profiles(email, full_name)')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('products')
      .select('id, title, stock')
      .eq('is_active', true)
      .lte('stock', 10)
      .order('stock', { ascending: true })
      .limit(5),
  ]);

  // Calculate metrics
  const totalRevenue30d = ordersLast30Days?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
  const totalRevenue7d = ordersLast7Days?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
  const avgOrderValue = ordersLast30Days?.length
    ? totalRevenue30d / ordersLast30Days.length
    : 0;

  // Calculate order status distribution
  const statusCounts: OrderStatusCount[] = [];
  const statusMap = new Map<string, number>();
  ordersLast30Days?.forEach((order) => {
    statusMap.set(order.status, (statusMap.get(order.status) || 0) + 1);
  });
  statusMap.forEach((count, status) => {
    statusCounts.push({ status, count });
  });

  // Calculate fulfillment rate
  const deliveredCount = statusMap.get('delivered') || 0;
  const cancelledCount = statusMap.get('cancelled') || 0;
  const totalCompleted = deliveredCount + cancelledCount;
  const fulfillmentRate = totalCompleted > 0 ? (deliveredCount / totalCompleted) * 100 : 100;

  // Calculate daily revenue for chart
  const last14Days = eachDayOfInterval({
    start: subDays(new Date(), 13),
    end: new Date(),
  });

  const dailyRevenueMap = new Map<string, { revenue: number; orders: number }>();
  last14Days.forEach((day) => {
    dailyRevenueMap.set(format(day, 'yyyy-MM-dd'), { revenue: 0, orders: 0 });
  });

  ordersLast30Days?.forEach((order) => {
    const dateKey = format(new Date(order.created_at), 'yyyy-MM-dd');
    if (dailyRevenueMap.has(dateKey)) {
      const existing = dailyRevenueMap.get(dateKey)!;
      existing.revenue += order.total || 0;
      existing.orders += 1;
    }
  });

  const dailyRevenue: DailyRevenue[] = Array.from(dailyRevenueMap.entries()).map(
    ([date, data]) => ({
      date: format(new Date(date), 'MMM d'),
      revenue: Math.round(data.revenue * 100) / 100,
      orders: data.orders,
    })
  );

  // Calculate top selling products
  const productSales = new Map<string, { title: string; quantity: number; revenue: number }>();
  orderItems?.forEach((item) => {
    const existing = productSales.get(item.product_id) || {
      title: item.product_title,
      quantity: 0,
      revenue: 0,
    };
    existing.quantity += item.quantity;
    existing.revenue += item.price_at_purchase * item.quantity;
    productSales.set(item.product_id, existing);
  });

  const topProducts: TopProduct[] = Array.from(productSales.entries())
    .map(([id, data]) => ({
      id,
      title: data.title,
      total_sold: data.quantity,
      total_revenue: Math.round(data.revenue * 100) / 100,
    }))
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, 5);

  const stats = [
    {
      label: 'Active Products',
      value: productCount || 0,
      icon: Package,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      label: 'Total Orders',
      value: orderCount || 0,
      icon: ShoppingCart,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      label: 'Customers',
      value: customerCount || 0,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
    {
      label: 'Revenue (30d)',
      value: formatCurrency(totalRevenue30d),
      icon: DollarSign,
      color: 'text-gold',
      bgColor: 'bg-gold/10',
    },
  ];

  const secondaryStats = [
    {
      label: 'Revenue (7d)',
      value: formatCurrency(totalRevenue7d),
      icon: TrendingUp,
      color: 'text-emerald-400',
    },
    {
      label: 'Avg Order Value',
      value: formatCurrency(avgOrderValue),
      icon: DollarSign,
      color: 'text-amber-400',
    },
    {
      label: 'Fulfillment Rate',
      value: `${fulfillmentRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: fulfillmentRate >= 95 ? 'text-green-400' : fulfillmentRate >= 80 ? 'text-yellow-400' : 'text-red-400',
    },
    {
      label: 'Pending Orders',
      value: statusMap.get('pending') || 0,
      icon: Clock,
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-gold">Dashboard</h1>
        <p className="text-gold/50 text-sm">Last updated: {format(new Date(), 'MMM d, h:mm a')}</p>
      </div>

      {/* Primary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-navy-800 border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-gold/70 text-sm font-medium">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mt-3">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {secondaryStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-navy-800/50 border border-gold/10 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-gold/60 text-sm">{stat.label}</span>
            </div>
            <p className="text-xl font-semibold text-white mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="bg-navy-800 border border-gold/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gold mb-4">Revenue (Last 14 Days)</h2>
          <AdminAnalyticsCharts dailyRevenue={dailyRevenue} />
        </div>

        {/* Top Products */}
        <div className="bg-navy-800 border border-gold/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gold mb-4">Top Selling Products</h2>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gold/50 text-sm font-mono w-6">#{index + 1}</span>
                    <div>
                      <p className="text-white font-medium text-sm truncate max-w-[200px]">
                        {product.title}
                      </p>
                      <p className="text-gold/50 text-xs">{product.total_sold} sold</p>
                    </div>
                  </div>
                  <span className="text-gold font-semibold">
                    {formatCurrency(product.total_revenue)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gold/50 text-center py-8">No sales data yet</p>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-navy-800 border border-gold/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gold mb-4">Recent Orders</h2>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/20">
                    <th className="text-left text-gold/60 text-xs font-medium py-2 px-3">Order</th>
                    <th className="text-left text-gold/60 text-xs font-medium py-2 px-3">Customer</th>
                    <th className="text-left text-gold/60 text-xs font-medium py-2 px-3">Status</th>
                    <th className="text-right text-gold/60 text-xs font-medium py-2 px-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gold/10 hover:bg-navy-700/30">
                      <td className="py-3 px-3">
                        <span className="font-mono text-sm text-white">
                          {order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <p className="text-gold/50 text-xs">
                          {format(new Date(order.created_at), 'MMM d, h:mm a')}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-white text-sm">
                          {(order.profiles as any)?.full_name || 'Guest'}
                        </span>
                        <p className="text-gold/50 text-xs truncate max-w-[150px]">
                          {(order.profiles as any)?.email}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-gold font-semibold">
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gold/50 text-center py-8">No orders yet</p>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-navy-800 border border-gold/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-gold">Low Stock Alert</h2>
          </div>
          {lowStockProducts && lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg border border-amber-500/20"
                >
                  <p className="text-white text-sm truncate max-w-[150px]">{product.title}</p>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      product.stock === 0
                        ? 'bg-red-500/20 text-red-400'
                        : product.stock <= 5
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-gold/50">All products well stocked</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-navy-800 border border-gold/20 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gold mb-4">Order Status (Last 30 Days)</h2>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { status: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            { status: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { status: 'preparing', label: 'Preparing', icon: Package, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            { status: 'out_for_delivery', label: 'Out for Delivery', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400/10' },
            { status: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
            { status: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
          ].map((item) => (
            <div key={item.status} className={`p-4 rounded-lg ${item.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-gold/70 text-xs">{item.label}</span>
              </div>
              <p className={`text-2xl font-bold ${item.color}`}>
                {statusMap.get(item.status) || 0}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-400' },
    confirmed: { label: 'Confirmed', className: 'bg-blue-500/20 text-blue-400' },
    preparing: { label: 'Preparing', className: 'bg-purple-500/20 text-purple-400' },
    out_for_delivery: { label: 'Out for Delivery', className: 'bg-orange-500/20 text-orange-400' },
    delivered: { label: 'Delivered', className: 'bg-green-500/20 text-green-400' },
    cancelled: { label: 'Cancelled', className: 'bg-red-500/20 text-red-400' },
  };

  const config = statusConfig[status] || { label: status, className: 'bg-gray-500/20 text-gray-400' };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
