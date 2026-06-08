import React, { useState } from 'react';
import { Search, Filter, Eye, Trash2, Printer, Download, FileText, X } from 'lucide-react';
import { downloadInvoicePDF } from '../services/pdfService';
import { useInvoiceStore } from '../store/useInvoiceStore';
import ThermalBill from '../components/invoice/ThermalBill';
import type { Invoice } from '../types';

const METHOD_LABELS: Record<string, string> = {
  cash: '💵 Cash', gpay: '📲 GPay', phonepe: '📱 PhonePe', paytm: '💳 Paytm', upi: '🔗 UPI',
};

const STATUS_COLORS: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function HistoryPage() {
  const { invoices, deleteInvoice } = useInvoiceStore();
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    const matchSearch = inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customer.name.toLowerCase().includes(q) ||
      inv.customer.phone.includes(q);
    
    const matchStart = startDate ? inv.date >= startDate : true;
    const matchEnd = endDate ? inv.date <= endDate : true;

    return matchSearch && matchStart && matchEnd;
  });

  const handlePrint = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setTimeout(() => window.print(), 300);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Invoice History</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{invoices.length} total invoices</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by invoice no, customer name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:w-auto px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-500 shadow-sm"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full sm:w-auto px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">{invoices.length === 0 ? 'No invoices yet. Create your first order!' : 'No matching invoices found.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm text-gray-900 dark:text-white">{invoice.invoiceNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[invoice.status]}`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {invoice.date} · {invoice.time} · {METHOD_LABELS[invoice.paymentMethod] || invoice.paymentMethod}
                  </p>
                  {invoice.customer.name && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      👤 {invoice.customer.name} {invoice.customer.phone && `· ${invoice.customer.phone}`}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {invoice.items.slice(0, 3).map((item) => (
                      <span key={item.id} className="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                        {item.name} ×{item.quantity}
                      </span>
                    ))}
                    {invoice.items.length > 3 && (
                      <span className="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full">
                        +{invoice.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-lg text-emerald-600 dark:text-emerald-400">₹{invoice.grandTotal.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{invoice.items.reduce((a, i) => a + i.quantity, 0)} items</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setSelectedInvoice(selectedInvoice?.id === invoice.id ? null : invoice)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Eye size={12} />
                  {selectedInvoice?.id === invoice.id ? 'Hide' : 'View'}
                </button>
                <button
                  onClick={() => handlePrint(invoice)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                >
                  <Printer size={12} />
                  Print
                </button>
                <button
                  onClick={() => downloadInvoicePDF(invoice)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                >
                  <Download size={12} />
                  PDF
                </button>
                <button
                  onClick={() => setConfirmDelete(invoice.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors ml-auto"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>

              {/* Expanded bill preview */}
              {selectedInvoice?.id === invoice.id && (
                <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                  <ThermalBill invoice={invoice} size={invoice.printerSize} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 text-center">
            <Trash2 size={40} className="mx-auto text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Delete Invoice?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This cannot be undone.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-semibold">Cancel</button>
              <button onClick={() => { deleteInvoice(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Print-only area */}
      {selectedInvoice && (
        <div className="print-only fixed inset-0 bg-white z-[999] flex items-center justify-center">
          <ThermalBill invoice={selectedInvoice} size={selectedInvoice.printerSize} />
        </div>
      )}
    </div>
  );
}
