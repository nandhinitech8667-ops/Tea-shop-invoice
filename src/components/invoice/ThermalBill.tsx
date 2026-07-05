
import type { Invoice } from '../../types';

interface Props {
  invoice: Invoice;
  size?: 'standard' | '80mm' | '58mm';
}

const METHOD_LABELS: Record<string, string> = {
  cash: 'Cash',
  gpay: 'Google Pay',
  phonepe: 'PhonePe',
  paytm: 'Paytm',
  upi: 'UPI',
};

function Line({ char = '-', count = 32 }: { char?: string; count?: number }) {
  return <div className="text-center text-gray-500">{char.repeat(count)}</div>;
}

export default function ThermalBill({ invoice, size = 'standard' }: Props) {
  const isNarrow = size === '58mm';
  const lineLen = isNarrow ? 28 : 32;

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const formatTime = (timeStr: string) => {
    const [h, min] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${String(min).padStart(2, '0')} ${ampm}`;
  };

  return (
    <div
      className={`font-mono text-xs leading-relaxed bg-white text-gray-900 ${
        isNarrow ? 'w-[58mm] text-[10px]' : 'w-[80mm] text-xs'
      } p-2 mx-auto`}
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      {/* Shop Header */}
      <div className="text-center font-bold mb-1">
        <Line char="=" count={lineLen} />
        <div className="text-sm font-black">{invoice.shop.name.toUpperCase()}</div>
        <div className="text-[9px] italic mb-0.5">Brewing Happiness in Every Cup</div>
        <div className="text-[10px] mt-0.5">{invoice.shop.address}</div>
        <div className="text-[10px]">Ph: {invoice.shop.phone}</div>
        {invoice.shop.gstin && <div className="text-[10px]">GSTIN: {invoice.shop.gstin}</div>}
        <Line char="=" count={lineLen} />
      </div>

      {/* Invoice Meta */}
      <div className="space-y-0.5 text-[11px]">
        <div className="flex justify-between">
          <span>Invoice No:</span>
          <span className="font-bold">{invoice.invoiceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{formatDate(invoice.date)}</span>
        </div>
        <div className="flex justify-between">
          <span>Time:</span>
          <span>{formatTime(invoice.time)}</span>
        </div>
        {invoice.customer.name && (
          <div className="flex justify-between">
            <span>Customer:</span>
            <span>{invoice.customer.name}</span>
          </div>
        )}
        {invoice.customer.phone && (
          <div className="flex justify-between">
            <span>Phone:</span>
            <span>{invoice.customer.phone}</span>
          </div>
        )}
      </div>

      <Line count={lineLen} />

      {/* Items Header */}
      <div className="flex font-bold text-[10px]">
        <span className="flex-1">Item</span>
        <span className="w-8 text-center">Qty</span>
        <span className="w-16 text-right">Amount</span>
      </div>

      <Line count={lineLen} />

      {/* Items */}
      {invoice.items.map((item) => (
        <div key={item.id}>
          <div className="flex text-[11px]">
            <span className="flex-1 truncate pr-1">{item.name}</span>
            <span className="w-8 text-center">{item.quantity}</span>
            <span className="w-16 text-right">₹{item.subtotal.toFixed(2)}</span>
          </div>
          <div className="text-[10px] text-gray-500 pl-0">
            {item.quantity} x ₹{item.price}
          </div>
        </div>
      ))}

      <Line count={lineLen} />

      {/* Totals */}
      <div className="space-y-0.5 text-[11px]">
        <div className="flex justify-between">
          <span>Sub Total</span>
          <span>₹{invoice.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>GST ({invoice.gstPercent}%)</span>
          <span>₹{invoice.gstAmount.toFixed(2)}</span>
        </div>
        {invoice.discountAmount > 0 && (
          <div className="flex justify-between">
            <span>Discount ({invoice.discountPercent}%)</span>
            <span>-₹{invoice.discountAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <Line char="=" count={lineLen} />

      <div className="flex justify-between font-black text-sm">
        <span>TOTAL</span>
        <span>₹{invoice.grandTotal.toFixed(2)}</span>
      </div>

      <Line char="=" count={lineLen} />

      {/* Payment */}
      <div className="text-[11px] space-y-0.5">
        <div className="flex justify-between">
          <span>Payment:</span>
          <span className="font-bold">{METHOD_LABELS[invoice.paymentMethod] || invoice.paymentMethod}</span>
        </div>
        {invoice.transactionId && (
          <div className="flex justify-between">
            <span>Txn ID:</span>
            <span className="font-mono">{invoice.transactionId}</span>
          </div>
        )}
      </div>

      <Line count={lineLen} />

      {/* Footer */}
      <div className="text-center text-[10px] space-y-0.5">
        <div className="font-bold">Thank You!</div>
        <div>Visit Again 🙏</div>
        <div className="text-gray-400 mt-1">Powered by TeaPOS</div>
      </div>

      <Line char="=" count={lineLen} />
    </div>
  );
}
