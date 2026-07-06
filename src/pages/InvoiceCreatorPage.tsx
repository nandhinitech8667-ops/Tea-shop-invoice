import React from 'react';
import { InvoiceForm } from '../components/InvoiceForm';
import { InvoicePreview } from '../components/InvoicePreview';

export const InvoiceCreatorPage: React.FC = () => {
  return (
    <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">
      {/* Form area */}
      <div className="w-full lg:col-span-7 xl:col-span-8">
        <InvoiceForm />
      </div>

      {/* Live Preview area */}
      <div className="w-full lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20">
        <InvoicePreview />
      </div>
    </div>
  );
};
