import React from 'react';
import { CheckCircle2, Printer, RotateCcw } from 'lucide-react';

interface Props {
  transactionId: string;
  amount: number;
  paymentMethod: string;
  onClose: () => void;
  onPrint: () => void;
}

const METHOD_LABELS: Record<string, string> = {
  cash: '💵 Cash',
  gpay: '📲 Google Pay',
  phonepe: '📱 PhonePe',
  paytm: '💳 Paytm',
  upi: '🔗 UPI',
};

export default function PaymentSuccessModal({ transactionId, amount, paymentMethod, onClose, onPrint }: Props) {
  return (
    <div className="flex flex-col items-center py-4 px-2 text-center">
      {/* Animated check */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4 animate-bounce-once">
        <CheckCircle2 size={48} className="text-emerald-500" />
      </div>

      <h2 className="text-xl font-black text-gray-900 dark:text-white">Payment Successful!</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{METHOD_LABELS[paymentMethod] || paymentMethod}</p>

      {/* Details card */}
      <div className="mt-5 w-full bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 space-y-3 text-left">
        <div className="flex justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</span>
          <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-100">{transactionId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">Amount Paid</span>
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Thank You */}
      <div className="mt-5">
        <p className="text-lg font-bold text-gray-800 dark:text-gray-100">🙏 Thank You!</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Visit Again</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-5 w-full">
        <button
          onClick={onPrint}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold text-sm rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
        >
          <Printer size={15} />
          Print Bill
        </button>
        <button
          onClick={onClose}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-colors"
        >
          <RotateCcw size={15} />
          New Order
        </button>
      </div>
    </div>
  );
}
