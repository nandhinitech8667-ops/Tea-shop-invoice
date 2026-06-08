import type { Invoice, DashboardStats, PaymentMode } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const getDashboardStats = (invoices: Invoice[]): DashboardStats => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  // 1. Filter today's invoices
  const todaysInvoices = invoices.filter(
    (inv) => inv.date === todayStr && inv.status !== 'cancelled'
  );

  const todaySales = todaysInvoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
  const todayOrders = todaysInvoices.length;
  const averageOrderValue = todayOrders > 0 ? Number((todaySales / todayOrders).toFixed(2)) : 0;

  // 2. Revenue by Payment Mode
  const revenueByPaymentMode: Record<PaymentMode, number> = {
    cash: 0,
    upi: 0,
    card: 0,
    wallet: 0
  };

  invoices
    .filter((inv) => inv.status !== 'cancelled')
    .forEach((inv) => {
      if (revenueByPaymentMode[inv.paymentMode] !== undefined) {
        revenueByPaymentMode[inv.paymentMode] += inv.grandTotal;
      }
    });

  // 3. Popular Items (Aggregated across all invoices)
  const itemMap: Record<string, { quantity: number; sales: number }> = {};
  invoices
    .filter((inv) => inv.status !== 'cancelled')
    .forEach((inv) => {
      inv.items.forEach((item) => {
        if (!itemMap[item.name]) {
          itemMap[item.name] = { quantity: 0, sales: 0 };
        }
        itemMap[item.name].quantity += item.quantity;
        itemMap[item.name].sales += item.subtotal;
      });
    });

  const popularItems = Object.entries(itemMap)
    .map(([name, data]) => ({
      name,
      quantity: data.quantity,
      sales: Number(data.sales.toFixed(2))
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5); // top 5 products

  // 4. Weekly Sales (Last 7 days)
  const weeklySalesMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayVal = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${dayVal}`;
    weeklySalesMap[key] = 0;
  }

  invoices
    .filter((inv) => inv.status !== 'cancelled')
    .forEach((inv) => {
      if (weeklySalesMap[inv.date] !== undefined) {
        weeklySalesMap[inv.date] += inv.grandTotal;
      }
    });

  const weeklySales = Object.entries(weeklySalesMap).map(([date, amount]) => {
    // Format date nicely for display, e.g. "05 Jun"
    const [y, m, d] = date.split('-');
    const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
    const label = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    return {
      date: label,
      amount: Number(amount.toFixed(2))
    };
  });

  return {
    todaySales: Number(todaySales.toFixed(2)),
    todayOrders,
    averageOrderValue,
    revenueByPaymentMode,
    popularItems,
    weeklySales
  };
};
