// ─── Invoice Types ───────────────────────────────────────────────────────────

export interface InvoiceItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
}

export interface ShopDetails {
  name: string;
  logoUrl?: string;
  address: string;
  phone: string;
  gstin: string;
  upiId: string;
  upiName: string;
  defaultGstPercent: number;
  adminPin: string;
  cashierPin: string;
}

export type UserRole = 'admin' | 'cashier' | null;

export type PaymentMethod = 'cash' | 'gpay' | 'phonepe' | 'paytm' | 'upi';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  time: string;
  customer: CustomerDetails;
  shop: ShopDetails;
  items: InvoiceItem[];
  subtotal: number;
  gstPercent: number;
  gstAmount: number;
  discountPercent: number;
  discountAmount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  status: 'paid' | 'pending' | 'cancelled';
  printerSize: 'standard' | '80mm' | '58mm';
}

// ─── Product / Inventory Types ────────────────────────────────────────────────

export type ProductCategory = 'Tea' | 'Coffee' | 'Snacks' | 'Cool Drinks';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  imageUrl: string;
  available: boolean;
  emoji: string;
}

// ─── Dashboard Types ──────────────────────────────────────────────────────────

export interface DashboardStats {
  todaySales: number;
  todayOrders: number;
  monthlyRevenue: number;
  averageOrderValue: number;
  totalProducts: number;
  lowStockCount: number;
  popularItems: { name: string; quantity: number; sales: number }[];
  weeklySales: { date: string; amount: number }[];
  categorySales: { name: string; value: number }[];
  revenueByPaymentMethod: Record<PaymentMethod, number>;
}

// ─── Payment Flow Types ───────────────────────────────────────────────────────

export type PaymentStep = 'select' | 'qr' | 'success';

export interface PaymentState {
  isOpen: boolean;
  amount: number;
  method: PaymentMethod;
  step: PaymentStep;
  transactionId: string;
}
