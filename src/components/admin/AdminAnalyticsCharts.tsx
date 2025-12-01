'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

interface AdminAnalyticsChartsProps {
  dailyRevenue: DailyRevenue[];
}

export function AdminAnalyticsCharts({ dailyRevenue }: AdminAnalyticsChartsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-900 border border-gold/30 rounded-lg p-3 shadow-xl">
          <p className="text-gold font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm">
              {entry.dataKey === 'revenue' ? (
                <span className="text-emerald-400">
                  Revenue: {formatCurrency(entry.value)}
                </span>
              ) : (
                <span className="text-blue-400">Orders: {entry.value}</span>
              )}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!dailyRevenue || dailyRevenue.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gold/50">
        No revenue data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={dailyRevenue}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#D4AF37"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface OrdersChartProps {
  dailyOrders: DailyRevenue[];
}

export function OrdersChart({ dailyOrders }: OrdersChartProps) {
  if (!dailyOrders || dailyOrders.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gold/50">
        No order data available
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dailyOrders}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0a1a',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#D4AF37' }}
          />
          <Bar
            dataKey="orders"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
