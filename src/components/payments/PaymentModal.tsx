import { X, ArrowLeft, CheckCircle } from 'lucide-react';
import { usePaymentStore } from '../../store/usePaymentStore';
import { useInvoiceStore } from '../../store/useInvoiceStore';
import { useProductStore } from '../../store/useProductStore';
import QRCodeDisplay from './QRCodeDisplay';
import PaymentSuccessModal from './PaymentSuccessModal';

type PaymentMethod = 'cash' | 'gpay' | 'phonepe' | 'paytm' | 'upi';

const METHODS: { id: PaymentMethod; label: string; emoji: string; color: string; description: string }[] = [
  { id: 'cash',    label: 'Cash',        emoji: '💵', color: 'border-green-400 bg-green-50 dark:bg-green-900/20',   description: 'Physical cash payment' },
  { id: 'gpay',    label: 'Google Pay',  emoji: '📲', color: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20',     description: 'Pay via Google Pay' },
  { id: 'phonepe', label: 'PhonePe',     emoji: '📱', color: 'border-purple-400 bg-purple-50 dark:bg-purple-900/20', description: 'Pay via PhonePe' },
  { id: 'paytm',   label: 'Paytm',       emoji: '💳', color: 'border-sky-400 bg-sky-50 dark:bg-sky-900/20',       description: 'Pay via Paytm' },
  { id: 'upi',     label: 'Other UPI',   emoji: '🔗', color: 'border-orange-400 bg-orange-50 dark:bg-orange-900/20', description: 'Any UPI app' },
];

export default function PaymentModal() {
  const { isOpen, amount, method, step, transactionId, setMethod, proceedToQR, confirmPayment, closePayment } = usePaymentStore();
  const { shopDetails, activeItems, saveInvoice, activePaymentMethod } = useInvoiceStore();
  const { decrementStock } = useProductStore();


  if (!isOpen) return null;

  const handleConfirm = () => {
    const txnId = confirmPayment();
    // Decrement stock for each item
    activeItems.forEach((item) => {
      decrementStock(item.id, item.quantity);
    });
    saveInvoice(txnId);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    closePayment();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <div className="flex items-center gap-2">
            {step === 'qr' && (
              <button onClick={() => usePaymentStore.setState({ step: 'select' })} className="mr-1 hover:opacity-70">
                <ArrowLeft size={18} />
              </button>
            )}
            <span className="font-bold">
              {step === 'select' ? 'Choose Payment Method' : step === 'qr' ? 'Scan & Pay' : 'Payment Done!'}
            </span>
          </div>
          {step !== 'success' && (
            <button onClick={handleClose} className="hover:opacity-70 transition-opacity">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-5">
          {/* STEP 1 — Select Method */}
          {step === 'select' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                Total: <span className="font-black text-xl text-emerald-600 dark:text-emerald-400">₹{amount.toFixed(2)}</span>
              </p>
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-150 ${
                    method === m.id ? m.color + ' border-opacity-100 shadow-md scale-[1.02]' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{m.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{m.description}</p>
                  </div>
                  {method === m.id && <CheckCircle size={18} className="text-emerald-500" />}
                </button>
              ))}

              <button
                onClick={() => method === 'cash' ? handleConfirm() : proceedToQR()}
                className="mt-4 w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 hover:opacity-90 active:scale-95 transition-all"
              >
                {method === 'cash' ? '✅ Confirm Payment' : '📷 Show QR Code'}
              </button>
            </div>
          )}

          {/* STEP 2 — QR Code */}
          {step === 'qr' && (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Scan with{' '}
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {METHODS.find((m) => m.id === method)?.label}
                </span>{' '}
                or any UPI app
              </p>

              <QRCodeDisplay
                upiId={
                  method === 'gpay' ? 'teashopgpay@upi' :
                  method === 'phonepe' ? 'teashopphonepe@upi' :
                  method === 'paytm' ? 'teashoppaytm@upi' :
                  'teashop@upi'
                }
                upiName={shopDetails.upiName}
                amount={amount}
                method={method}
              />

              <button
                onClick={handleConfirm}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:opacity-90 active:scale-95 transition-all"
              >
                ✅ Payment Done / Confirm
              </button>
            </div>
          )}

          {/* STEP 3 — Success */}
          {step === 'success' && (
            <PaymentSuccessModal
              transactionId={transactionId}
              amount={amount}
              paymentMethod={activePaymentMethod}
              onClose={handleClose}
              onPrint={handlePrint}
            />
          )}
        </div>
      </div>
    </div>
  );
}
