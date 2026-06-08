import React from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { formatCurrency } from '../utils/helpers';
import { downloadInvoicePDF } from '../services/pdfService';
import { 
  Printer, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  Eye
} from 'lucide-react';

export const InvoicePreview: React.FC = () => {
  const {
    activeCustomer,
    activeItems,
    activePaymentMode,
    activePrinterSize,
    setActivePrinterSize,
    shopDetails,
    saveActiveInvoice,
    clearActiveInvoice
  } = useInvoiceStore();

  // Compute values
  const subtotal = activeItems.reduce((acc, item) => acc + item.subtotal, 0);
  const gstPercent = shopDetails.defaultGstPercent;
  const gstAmount = Number(((subtotal * gstPercent) / 100).toFixed(2));
  const grandTotal = Number((subtotal + gstAmount).toFixed(2));

  const handlePrint = () => {
    // Save to history first if there are items
    if (activeItems.length === 0) return;
    
    // Save invoice (which resets the active state)
    saveActiveInvoice();
    
    // Create temporary print view or redirect to print
    // To trigger clean print of just the receipt, we print by adding a utility printing class
    setTimeout(() => {
      // In a real application, we open a clean minimal print window or trigger window.print with custom media queries.
      // Since the user is viewing this live, we can open standard window print.
      window.print();
    }, 100);
  };

  const handleSaveOnly = () => {
    if (activeItems.length === 0) return;
    saveActiveInvoice();
  };

  const handleDownloadPDF = () => {
    if (activeItems.length === 0) return;
    
    // Build a temporary invoice object for PDF generator
    const tempInvoice = {
      id: 'preview',
      invoiceNumber: 'PREVIEW-' + new Date().toISOString().slice(0, 10).replace(/-/g, ''),
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer: activeCustomer,
      shop: shopDetails,
      items: activeItems,
      subtotal,
      gstPercent,
      gstAmount,
      grandTotal,
      paymentMode: activePaymentMode,
      status: 'paid' as const,
      printerSize: activePrinterSize
    };
    
    downloadInvoicePDF(tempInvoice);
  };

  const sizeLabels = {
    standard: 'A4 Standard',
    '80mm': '80mm POS',
    '58mm': '58mm POS'
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-premium p-6 flex flex-col h-full justify-between no-print">
      
      <div>
        {/* --- HEADER CONTROLS --- */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50 dark:border-zinc-800 flex-wrap gap-3">
          <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-sm uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-700" />
            Live Preview
          </h4>
          
          {/* Printer width switcher */}
          <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
            {(['standard', '80mm', '58mm'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setActivePrinterSize(size)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
                  activePrinterSize === size
                    ? 'bg-white dark:bg-zinc-700 text-emerald-800 dark:text-emerald-300 shadow-sm'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700'
                }`}
              >
                {sizeLabels[size]}
              </button>
            ))}
          </div>
        </div>

        {/* --- DYNAMIC PREVIEW CANVAS CONTAINER --- */}
        <div className="flex justify-center bg-slate-50 dark:bg-zinc-950 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800/60 overflow-y-auto max-h-[500px]">
          
          {/* --- STANDARD INVOICE LAYOUT (A4 STYLE) --- */}
          {activePrinterSize === 'standard' && (
            <div className="w-full bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 shadow-sm p-6 text-xs text-slate-700 dark:text-zinc-300 rounded-xl leading-relaxed">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h5 className="font-extrabold text-slate-800 dark:text-white text-base tracking-tight">
                    {shopDetails.name}
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-[180px]">{shopDetails.address}</p>
                  <p className="text-[10px] text-slate-400">GSTIN: {shopDetails.gstin}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                    Tax Invoice
                  </span>
                  <p className="text-[10px] text-slate-400">Invoice No: TS-YYYYMMDD-XXX</p>
                  <p className="text-[10px] text-slate-400">Date: {new Date().toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              {/* Customer Box */}
              <div className="p-3 bg-[#FDFBF7] dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-800/80 mb-6 flex justify-between gap-4">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">BILLED TO:</p>
                  <p className="font-bold text-slate-800 dark:text-zinc-200">
                    {activeCustomer.name || 'Walk-in Customer'}
                  </p>
                  <p className="text-[10px] text-slate-400">{activeCustomer.phone || 'Phone: N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">PAYMENT DETAILS:</p>
                  <p className="font-bold text-slate-800 dark:text-zinc-200 uppercase">{activePaymentMode}</p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">PAID</p>
                </div>
              </div>

              {/* Items Grid */}
              <table className="w-full mb-6 text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-2">Tea / Item</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Qty</th>
                    <th className="pb-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40">
                  {activeItems.length > 0 ? (
                    activeItems.map((item, idx) => (
                      <tr key={idx} className="text-[11px]">
                        <td className="py-2.5 font-bold text-slate-800 dark:text-zinc-200">{item.name}</td>
                        <td className="py-2.5 text-right">{formatCurrency(item.price)}</td>
                        <td className="py-2.5 text-right">{item.quantity}</td>
                        <td className="py-2.5 text-right font-bold">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                        No items added
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-zinc-800">
                <div className="w-48 space-y-1.5 text-right text-[11px]">
                  <div className="flex justify-between text-slate-400 font-medium">
                    <span>Subtotal:</span>
                    <span className="text-slate-700 dark:text-zinc-200">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-medium">
                    <span>GST ({gstPercent}%):</span>
                    <span className="text-slate-700 dark:text-zinc-200">{formatCurrency(gstAmount)}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-emerald-800 dark:text-emerald-400 pt-1 border-t border-slate-100 dark:border-zinc-800">
                    <span>Grand Total:</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- 80mm THERMAL RECEIPT LAYOUT --- */}
          {activePrinterSize === '80mm' && (
            <div className="w-[80mm] max-w-[80mm] bg-white text-slate-900 border border-slate-200 p-4 font-mono text-[11px] shadow-sm rounded-lg leading-tight select-none">
              <div className="text-center mb-3">
                <h5 className="font-extrabold text-sm uppercase tracking-tight">{shopDetails.name}</h5>
                <p className="text-[9px] text-slate-500 mt-0.5">{shopDetails.address}</p>
                <p className="text-[9px] text-slate-500">Phone: {shopDetails.phone}</p>
                <p className="text-[9px] text-slate-500">GST: {shopDetails.gstin}</p>
              </div>

              <div className="border-b border-dashed border-slate-300 pb-2 mb-2">
                <p>Invoice: TS-YYYYMMDD-XXX</p>
                <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
                <p>Cust: {activeCustomer.name || 'Walk-in'}</p>
                {activeCustomer.phone && <p>Ph: {activeCustomer.phone}</p>}
              </div>

              {/* Items list */}
              <div className="space-y-1 border-b border-dashed border-slate-300 pb-2 mb-2">
                <div className="flex justify-between font-bold text-[10px]">
                  <span>Item</span>
                  <span className="w-24 text-right">Qty x Price = Sub</span>
                </div>
                {activeItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate max-w-[120px]">{item.name}</span>
                    <span className="w-24 text-right">{item.quantity} x {item.price} = {item.subtotal}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1 text-right">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rs.{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({gstPercent}%):</span>
                  <span>Rs.{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm border-t border-dashed border-slate-300 pt-1">
                  <span>Total:</span>
                  <span>Rs.{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center mt-4 pt-2 border-t border-dashed border-slate-300 text-[9px] text-slate-500">
                <p>Payment Mode: {activePaymentMode.toUpperCase()}</p>
                <p className="font-bold mt-1">THANK YOU! VISIT AGAIN!</p>
              </div>
            </div>
          )}

          {/* --- 58mm THERMAL RECEIPT LAYOUT --- */}
          {activePrinterSize === '58mm' && (
            <div className="w-[58mm] max-w-[58mm] bg-white text-slate-900 border border-slate-200 p-2.5 font-mono text-[9px] shadow-sm rounded-lg leading-tight select-none">
              <div className="text-center mb-2">
                <h5 className="font-extrabold text-[10px] uppercase tracking-tight">{shopDetails.name}</h5>
                <p className="text-[7.5px] text-slate-500">{shopDetails.address}</p>
                <p className="text-[7.5px] text-slate-500">GST: {shopDetails.gstin}</p>
              </div>

              <div className="border-b border-dashed border-slate-300 pb-1.5 mb-1.5">
                <p>Bill: TS-YYYYMMDD-XXX</p>
                <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
                <p>Cust: {activeCustomer.name.slice(0, 10) || 'Walk-in'}</p>
              </div>

              {/* Items list */}
              <div className="space-y-1 border-b border-dashed border-slate-300 pb-1.5 mb-1.5">
                {activeItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between leading-snug">
                    <span className="truncate max-w-[80px]">{item.name}</span>
                    <span>{item.quantity}x{item.price}={item.subtotal}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-0.5 text-right">
                <div className="flex justify-between">
                  <span>Sub:</span>
                  <span>Rs.{subtotal.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST({gstPercent}%):</span>
                  <span>Rs.{gstAmount.toFixed(1)}</span>
                </div>
                <div className="flex justify-between font-bold text-[10px] border-t border-dashed border-slate-300 pt-1">
                  <span>Total:</span>
                  <span>Rs.{grandTotal.toFixed(1)}</span>
                </div>
              </div>

              <div className="text-center mt-3 text-[7.5px] text-slate-500">
                <p>PAY: {activePaymentMode.toUpperCase()}</p>
                <p className="font-bold">THANK YOU!</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* --- BOTTOM ACTION BUTTONS --- */}
      <div className="mt-6 pt-4 border-t border-slate-50 dark:border-zinc-800 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={activeItems.length === 0}
            className="flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs font-bold text-slate-700 dark:text-zinc-300 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-4.5 h-4.5" />
            PDF Export
          </button>
          
          <button
            onClick={handleSaveOnly}
            disabled={activeItems.length === 0}
            className="flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs font-bold text-slate-700 dark:text-zinc-300 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-4.5 h-4.5" />
            Save Invoice
          </button>
        </div>

        <button
          onClick={handlePrint}
          disabled={activeItems.length === 0}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xl shadow-emerald-700/10 hover:shadow-emerald-700/20 transition-all disabled:opacity-50 transform active:scale-[0.98]"
        >
          <Printer className="w-5 h-5 stroke-[2.5]" />
          Save & Print Receipt
        </button>

        <button
          onClick={clearActiveInvoice}
          className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

    </div>
  );
};
