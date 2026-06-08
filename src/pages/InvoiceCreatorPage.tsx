import React, { useState } from 'react';
import { InvoiceForm } from '../components/InvoiceForm';
import { InvoicePreview } from '../components/InvoicePreview';
import { ClipboardEdit, FileText } from 'lucide-react';

export const InvoiceCreatorPage: React.FC = () => {
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  return (
    <div className="h-full">
      {/* Mobile Top Toggle Tab Bar */}
      <div className="flex md:hidden bg-slate-100 dark:bg-zinc-800/80 p-1 rounded-2xl mb-4 gap-1">
        <button
          onClick={() => setMobileTab('form')}
          className={`flex-1 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            mobileTab === 'form'
              ? 'bg-white dark:bg-zinc-750 text-emerald-800 dark:text-emerald-300 shadow-sm'
              : 'text-slate-500 dark:text-zinc-400'
          }`}
        >
          <ClipboardEdit className="w-4 h-4" />
          POS Cart & Customer
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            mobileTab === 'preview'
              ? 'bg-white dark:bg-zinc-750 text-emerald-800 dark:text-emerald-300 shadow-sm'
              : 'text-slate-500 dark:text-zinc-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          Live Receipt Preview
        </button>
      </div>

      {/* Responsive Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
        
        {/* Form area */}
        <div className={`lg:col-span-7 xl:col-span-8 ${mobileTab === 'form' ? 'block' : 'hidden md:block'}`}>
          <InvoiceForm />
        </div>

        {/* Live Preview area */}
        <div className={`lg:col-span-5 xl:col-span-4 ${mobileTab === 'preview' ? 'block' : 'hidden md:block'} lg:sticky lg:top-20`}>
          <InvoicePreview />
        </div>

      </div>
    </div>
  );
};
