
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Percent, ChevronDown } from 'lucide-react';
import { useInvoiceStore } from '../../store/useInvoiceStore';
import { usePaymentStore } from '../../store/usePaymentStore';

export default function CartPanel() {
  const {
    activeItems,
    activeCustomer,
    activeGstPercent,
    activeDiscountPercent,
    setActiveCustomer,
    removeActiveItem,
    updateActiveItemQty,
    setActiveGstPercent,
    setActiveDiscountPercent,
    getSubtotal,
    getGstAmount,
    getDiscountAmount,
    getGrandTotal,
    clearActiveInvoice,
    setActivePaymentMethod,
  } = useInvoiceStore();

  const { openPayment } = usePaymentStore();

  const subtotal = getSubtotal();
  const gstAmount = getGstAmount();
  const discountAmount = getDiscountAmount();
  const grandTotal = getGrandTotal();
  const hasItems = activeItems.length > 0;

  const handlePayNow = () => {
    if (!hasItems) return;
    openPayment(grandTotal);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-emerald-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} />
          <span className="font-bold">Cart</span>
          {hasItems && (
            <span className="bg-white text-emerald-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeItems.reduce((a, i) => a + i.quantity, 0)}
            </span>
          )}
        </div>
        {(hasItems || activeCustomer.name || activeCustomer.phone || activeDiscountPercent > 0) && (
          <button
            onClick={clearActiveInvoice}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors shadow-sm"
          >
            <Plus size={12} />
            New Bill
          </button>
        )}
      </div>

      {/* Customer Fields */}
      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Customer Name (opt.)"
            value={activeCustomer.name}
            onChange={(e) => setActiveCustomer({ ...activeCustomer, name: e.target.value })}
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-400"
          />
          <input
            type="tel"
            placeholder="Phone (opt.)"
            value={activeCustomer.phone}
            onChange={(e) => setActiveCustomer({ ...activeCustomer, phone: e.target.value })}
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        {!hasItems ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
            <ShoppingCart size={36} className="mb-2 opacity-30" />
            <p className="text-sm">Cart is empty</p>
            <p className="text-xs mt-1">Click + on products to add</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {activeItems.map((item) => (
              <div key={item.id} className="px-3 py-2.5 flex items-center gap-2">
                {/* Name & Price */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{item.name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">₹{item.price} each</p>
                </div>

                {/* Qty stepper */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (item.quantity <= 1) removeActiveItem(item.id);
                      else updateActiveItemQty(item.id, item.quantity - 1);
                    }}
                    className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-gray-800 dark:text-gray-100">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateActiveItemQty(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                  >
                    <Plus size={11} />
                  </button>
                </div>

                {/* Subtotal */}
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 w-12 text-right">
                  ₹{item.subtotal}
                </span>

                {/* Remove */}
                <button
                  onClick={() => removeActiveItem(item.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals & Controls */}
      {hasItems && (
        <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-3 space-y-2">
          {/* GST & Discount row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                <Percent size={9} /> GST %
              </label>
              <select
                value={activeGstPercent}
                onChange={(e) => setActiveGstPercent(Number(e.target.value))}
                className="w-full text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-400"
              >
                {[0, 5, 12, 18, 28].map((v) => (
                  <option key={v} value={v}>{v}%</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                <ChevronDown size={9} /> Discount %
              </label>
              <select
                value={activeDiscountPercent}
                onChange={(e) => setActiveDiscountPercent(Number(e.target.value))}
                className="w-full text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-400"
              >
                {[0, 5, 10, 15, 20, 25].map((v) => (
                  <option key={v} value={v}>{v}%</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <label className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
              <CreditCard size={9} /> Payment Method
            </label>
            <select
              onChange={(e) => setActivePaymentMethod(e.target.value as 'cash' | 'gpay' | 'phonepe' | 'paytm' | 'upi')}
              className="w-full text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-400"
            >
              <option value="cash">💵 Cash</option>
              <option value="gpay">📲 Google Pay</option>
              <option value="phonepe">📱 PhonePe</option>
              <option value="paytm">💳 Paytm</option>
              <option value="upi">🔗 UPI</option>
            </select>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-2.5 space-y-1">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>GST ({activeGstPercent}%)</span>
              <span>+₹{gstAmount.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-green-600 dark:text-green-400">
                <span>Discount ({activeDiscountPercent}%)</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-600 pt-1.5">
              <span>Total</span>
              <span className="text-emerald-600 dark:text-emerald-400">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Pay Now Button */}
          <button
            onClick={handlePayNow}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/30 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2"
          >
            <CreditCard size={16} />
            Pay Now — ₹{grandTotal.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}
