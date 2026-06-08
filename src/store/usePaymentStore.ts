import { create } from 'zustand';
import type { PaymentMethod, PaymentStep } from '../types';

interface PaymentStoreState {
  isOpen: boolean;
  amount: number;
  method: PaymentMethod;
  step: PaymentStep;
  transactionId: string;
  openPayment: (amount: number) => void;
  setMethod: (method: PaymentMethod) => void;
  proceedToQR: () => void;
  confirmPayment: () => string;
  closePayment: () => void;
  reset: () => void;
}

function generateTxnId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TXN';
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const usePaymentStore = create<PaymentStoreState>((set, get) => ({
  isOpen: false,
  amount: 0,
  method: 'cash',
  step: 'select',
  transactionId: '',

  openPayment: (amount) => {
    set({ isOpen: true, amount, step: 'select', method: 'cash', transactionId: '' });
  },

  setMethod: (method) => {
    set({ method });
  },

  proceedToQR: () => {
    const { method } = get();
    if (method === 'cash') {
      // Cash payments go directly to success
      const txnId = generateTxnId();
      set({ step: 'success', transactionId: txnId });
    } else {
      set({ step: 'qr' });
    }
  },

  confirmPayment: () => {
    const txnId = generateTxnId();
    set({ step: 'success', transactionId: txnId });
    return txnId;
  },

  closePayment: () => {
    set({ isOpen: false, step: 'select', transactionId: '' });
  },

  reset: () => {
    set({ isOpen: false, amount: 0, method: 'cash', step: 'select', transactionId: '' });
  }
}));
