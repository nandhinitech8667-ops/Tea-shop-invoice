import { TrendingUp, IndianRupee, ShoppingBag } from 'lucide-react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';

export default function ReportsPage() {
  const { invoices } = useInvoiceStore();

  // Last 30 days daily sales
  const dailySales = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const amount = invoices.filter((inv) => inv.date === dateStr).reduce((sum, inv) => sum + inv.grandTotal, 0);
    const orders = invoices.filter((inv) => inv.date === dateStr).length;
    return { date: label, amount, orders };
  });

  // Payment method breakdown
  const payBreakdown: Record<string, { count: number; revenue: number }> = {};
  invoices.forEach((inv) => {
    const k = inv.paymentMethod || 'cash';
    if (!payBreakdown[k]) payBreakdown[k] = { count: 0, revenue: 0 };
    payBreakdown[k].count++;
    payBreakdown[k].revenue += inv.grandTotal;
  });

  const payLabels: Record<string, string> = {
    cash: '💵 Cash', gpay: '📲 Google Pay', phonepe: '📱 PhonePe', paytm: '💳 Paytm', upi: '🔗 UPI'
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalOrders = invoices.length;
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Sales Reports</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">All-time performance overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: IndianRupee, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Avg Order Value', value: `₹${avgOrder.toFixed(2)}`, icon: TrendingUp, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`${card.color} rounded-2xl p-5 shadow-sm`}>
              <Icon size={24} className="mb-2" />
              <p className="text-2xl font-black">{card.value}</p>
              <p className="text-xs mt-0.5 opacity-70">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* 30-Day Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="font-bold text-gray-800 dark:text-white mb-4">30-Day Revenue</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dailySales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Revenue']} />
            <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 30-Day Orders Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="font-bold text-gray-800 dark:text-white mb-4">30-Day Orders</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={dailySales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="font-bold text-gray-800 dark:text-white mb-4">Payment Methods</h2>
        {Object.keys(payBreakdown).length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No payment data yet</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(payBreakdown).map(([key, data]) => {
              const pct = totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-200">{payLabels[key] || key}</span>
                    <span className="text-gray-500 dark:text-gray-400">{data.count} orders · ₹{data.revenue.toFixed(2)} ({pct.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
