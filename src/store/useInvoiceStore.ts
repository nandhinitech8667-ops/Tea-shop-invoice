import { create } from 'zustand';
import type { Invoice, InvoiceItem, CustomerDetails, ShopDetails, PaymentMethod, UserRole } from '../types';

interface InvoiceState {
  // Navigation & Auth
  userRole: UserRole;
  login: (pin: string) => boolean;
  logout: () => void;
  currentPage: 'dashboard' | 'pos' | 'history' | 'inventory' | 'reports';
  setCurrentPage: (page: 'dashboard' | 'pos' | 'history' | 'inventory' | 'reports') => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Shop Config
  shopDetails: ShopDetails;
  updateShopDetails: (details: Partial<ShopDetails>) => void;

  // Active Invoice / Cart
  activeCustomer: CustomerDetails;
  activeItems: InvoiceItem[];
  activePaymentMethod: PaymentMethod;
  activePrinterSize: 'standard' | '80mm' | '58mm';
  activeGstPercent: number;
  activeDiscountPercent: number;

  setActiveCustomer: (customer: CustomerDetails) => void;
  addActiveItem: (item: Omit<InvoiceItem, 'subtotal'>) => void;
  removeActiveItem: (id: string) => void;
  updateActiveItemQty: (id: string, quantity: number) => void;
  updateActiveItemPrice: (id: string, price: number) => void;
  setActivePaymentMethod: (mode: PaymentMethod) => void;
  setActivePrinterSize: (size: 'standard' | '80mm' | '58mm') => void;
  setActiveGstPercent: (pct: number) => void;
  setActiveDiscountPercent: (pct: number) => void;
  clearActiveInvoice: () => void;

  // Computed totals (call these as helpers)
  getSubtotal: () => number;
  getGstAmount: () => number;
  getDiscountAmount: () => number;
  getGrandTotal: () => number;

  // Saved Invoices
  invoices: Invoice[];
  saveInvoice: (transactionId: string) => Invoice;
  deleteInvoice: (id: string) => void;
}

const DEFAULT_SHOP: ShopDetails = {
  name: 'TEAZENIX CAFE',
  address: '123, Tea Garden Road, Chennai - 600001',
  phone: '+91 98765 43210',
  gstin: '33AAAAA0000A1Z5',
  upiId: 'teashop@upi',
  upiName: 'TEAZENIX CAFE',
  defaultGstPercent: 5,
  adminPin: '1234',
  cashierPin: '0000',
};

export const useInvoiceStore = create<InvoiceState>((set, get) => {
  const savedInvoices = localStorage.getItem('ts_invoices');
  const savedShop = localStorage.getItem('ts_shop');
  const savedTheme = localStorage.getItem('ts_theme');

  const initialTheme = (savedTheme as 'light' | 'dark') || 'light';
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  return {
    userRole: null,
    login: (pin: string) => {
      const state = get();
      if (pin === state.shopDetails.adminPin) {
        set({ userRole: 'admin', currentPage: 'dashboard' });
        return true;
      }
      if (pin === state.shopDetails.cashierPin) {
        set({ userRole: 'cashier', currentPage: 'pos' });
        return true;
      }
      return false;
    },
    logout: () => set({ userRole: null }),

    currentPage: 'dashboard',
    setCurrentPage: (page) => set({ currentPage: page }),

    theme: initialTheme,
    toggleTheme: () => {
      const newTheme = get().theme === 'light' ? 'dark' : 'light';
      set({ theme: newTheme });
      localStorage.setItem('ts_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (theme) => {
      set({ theme });
      localStorage.setItem('ts_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    shopDetails: savedShop ? JSON.parse(savedShop) : DEFAULT_SHOP,
    updateShopDetails: (details) => {
      set((state) => {
        const updated = { ...state.shopDetails, ...details };
        localStorage.setItem('ts_shop', JSON.stringify(updated));
        return { shopDetails: updated };
      });
    },

    activeCustomer: { name: '', phone: '' },
    activeItems: [],
    activePaymentMethod: 'cash',
    activePrinterSize: 'standard',
    activeGstPercent: savedShop ? JSON.parse(savedShop).defaultGstPercent : 5,
    activeDiscountPercent: 0,

    setActiveCustomer: (customer) => set({ activeCustomer: customer }),

    addActiveItem: (item) => {
      set((state) => {
        const existingIdx = state.activeItems.findIndex((i) => i.id === item.id);
        if (existingIdx > -1) {
          const updated = [...state.activeItems];
          const cur = updated[existingIdx];
          const newQty = cur.quantity + item.quantity;
          updated[existingIdx] = { ...cur, quantity: newQty, subtotal: Number((newQty * cur.price).toFixed(2)) };
          return { activeItems: updated };
        }
        const newItem: InvoiceItem = { ...item, subtotal: Number((item.quantity * item.price).toFixed(2)) };
        return { activeItems: [...state.activeItems, newItem] };
      });
    },

    removeActiveItem: (id) => {
      set((state) => ({ activeItems: state.activeItems.filter((i) => i.id !== id) }));
    },

    updateActiveItemQty: (id, quantity) => {
      set((state) => ({
        activeItems: state.activeItems.map((item) =>
          item.id === id ? { ...item, quantity, subtotal: Number((quantity * item.price).toFixed(2)) } : item
        )
      }));
    },

    updateActiveItemPrice: (id, price) => {
      set((state) => ({
        activeItems: state.activeItems.map((item) =>
          item.id === id ? { ...item, price, subtotal: Number((item.quantity * price).toFixed(2)) } : item
        )
      }));
    },

    setActivePaymentMethod: (mode) => set({ activePaymentMethod: mode }),
    setActivePrinterSize: (size) => set({ activePrinterSize: size }),
    setActiveGstPercent: (pct) => set({ activeGstPercent: pct }),
    setActiveDiscountPercent: (pct) => set({ activeDiscountPercent: pct }),

    clearActiveInvoice: () =>
      set((state) => ({
        activeCustomer: { name: '', phone: '' },
        activeItems: [],
        activePaymentMethod: 'cash',
        activeDiscountPercent: 0,
        activeGstPercent: state.shopDetails.defaultGstPercent
      })),

    getSubtotal: () => get().activeItems.reduce((acc, i) => acc + i.subtotal, 0),
    getGstAmount: () => {
      const subtotal = get().getSubtotal();
      return Number(((subtotal * get().activeGstPercent) / 100).toFixed(2));
    },
    getDiscountAmount: () => {
      const subtotal = get().getSubtotal();
      return Number(((subtotal * get().activeDiscountPercent) / 100).toFixed(2));
    },
    getGrandTotal: () => {
      const subtotal = get().getSubtotal();
      const gst = get().getGstAmount();
      const discount = get().getDiscountAmount();
      return Number((subtotal + gst - discount).toFixed(2));
    },

    invoices: savedInvoices ? JSON.parse(savedInvoices) : [],

    saveInvoice: (transactionId: string) => {
      const state = get();
      const subtotal = state.getSubtotal();
      const gstAmount = state.getGstAmount();
      const discountAmount = state.getDiscountAmount();
      const grandTotal = state.getGrandTotal();

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const todayCount = state.invoices.filter((inv) => inv.date === dateStr).length;
      const sequence = String(todayCount + 1).padStart(3, '0');
      const invoiceNumber = `INV${year}${month}${day}${sequence}`;

      const newInvoice: Invoice = {
        id: crypto.randomUUID(),
        invoiceNumber,
        date: dateStr,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        customer: state.activeCustomer,
        shop: state.shopDetails,
        items: state.activeItems,
        subtotal,
        gstPercent: state.activeGstPercent,
        gstAmount,
        discountPercent: state.activeDiscountPercent,
        discountAmount,
        grandTotal,
        paymentMethod: state.activePaymentMethod,
        transactionId,
        status: 'paid',
        printerSize: state.activePrinterSize
      };

      const updated = [newInvoice, ...state.invoices];
      set({ invoices: updated });
      localStorage.setItem('ts_invoices', JSON.stringify(updated));
      state.clearActiveInvoice();
      return newInvoice;
    },

    deleteInvoice: (id) => {
      set((state) => {
        const filtered = state.invoices.filter((inv) => inv.id !== id);
        localStorage.setItem('ts_invoices', JSON.stringify(filtered));
        return { invoices: filtered };
      });
    }
  };
});
