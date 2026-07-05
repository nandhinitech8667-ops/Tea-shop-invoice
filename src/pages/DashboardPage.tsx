import { TrendingUp, ShoppingBag, Package, AlertTriangle, IndianRupee, BarChart3 } from 'lucide-react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { useProductStore } from '../store/useProductStore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#f97316', '#0ea5e9', '#8b5cf6'];

export default function DashboardPage() {
  const { invoices } = useInvoiceStore();
  const { products } = useProductStore();

  const today = new Date().toISOString().split('T')[0];
  const todayInvoices = invoices.filter((inv) => inv.date === today);
  const todaySales = todayInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

  const thisMonth = today.substring(0, 7);
  const monthlyRevenue = invoices
    .filter((inv) => inv.date.startsWith(thisMonth))
    .reduce((sum, inv) => sum + inv.grandTotal, 0);

  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock <= 5 && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  // Weekly sales (last 7 days)
  const weeklySales = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const amount = invoices
      .filter((inv) => inv.date === dateStr)
      .reduce((sum, inv) => sum + inv.grandTotal, 0);
    return { day: dayLabel, amount };
  });

  // Top products
  const itemSales: Record<string, { qty: number; revenue: number }> = {};
  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      if (!itemSales[item.name]) itemSales[item.name] = { qty: 0, revenue: 0 };
      itemSales[item.name].qty += item.quantity;
      itemSales[item.name].revenue += item.subtotal;
    });
  });
  const topItems = Object.entries(itemSales)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Category sales pie
  const categorySales: Record<string, number> = {};
  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      categorySales[item.category] = (categorySales[item.category] || 0) + item.subtotal;
    });
  });
  const pieData = Object.entries(categorySales).map(([name, value]) => ({ name, value }));

  // Payment method breakdown
  const paymentBreakdown: Record<string, number> = {};
  invoices.forEach((inv) => {
    const key = inv.paymentMethod || 'cash';
    paymentBreakdown[key] = (paymentBreakdown[key] || 0) + inv.grandTotal;
  });

  const statCards = [
    { label: "Today's Sales",    value: `₹${todaySales.toFixed(2)}`,     icon: IndianRupee,    color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: "Today's Orders",   value: todayInvoices.length,             icon: ShoppingBag,    color: 'from-blue-500 to-blue-600',       bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Monthly Revenue',  value: `₹${monthlyRevenue.toFixed(2)}`, icon: TrendingUp,     color: 'from-purple-500 to-purple-600',   bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Total Products',   value: totalProducts,                    icon: Package,        color: 'from-amber-500 to-amber-600',     bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Low Stock Items',  value: lowStockCount,                    icon: AlertTriangle,  color: 'from-orange-500 to-orange-600',   bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'Total Invoices',   value: invoices.length,                  icon: BarChart3,      color: 'from-teal-500 to-teal-600',       bg: 'bg-teal-50 dark:bg-teal-900/20' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back! Here's your shop overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`${card.bg} rounded-2xl p-4 border border-white/50 dark:border-white/10 shadow-sm`}>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-md`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      {outOfStockCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertTriangle size={18} className="text-red-500" />
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            ⚠️ {outOfStockCount} product{outOfStockCount > 1 ? 's' : ''} out of stock! Go to Inventory to restock.
          </p>
        </div>
      )}

      {/* Weekly Sales Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="font-bold text-gray-800 dark:text-white mb-4">Weekly Sales</h2>
        {weeklySales.some((d) => d.amount > 0) ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Sales']} />
              <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <BarChart3 size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No sales data yet</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom row: Top Products + Category Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-gray-800 dark:text-white mb-4">Top Products</h2>
          {topItems.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Package size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No sales data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topItems.map((item, i) => {
                const maxRevenue = topItems[0].revenue;
                const pct = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={item.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-200 truncate flex-1 pr-2">{i + 1}. {item.name}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex-shrink-0">₹{item.revenue.toFixed(0)} ({item.qty} sold)</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category / Payment breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-gray-800 dark:text-white mb-4">Sales by Category</h2>
          {pieData.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <BarChart3 size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No sales data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Revenue']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
