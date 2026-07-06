import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { useProductStore } from '../store/useProductStore';
import { formatCurrency } from '../utils/helpers';
import { 
  User, 
  Phone, 
  Plus, 
  Minus, 
  Trash2, 
  Coffee, 
  ShoppingCart,
  CreditCard,
  QrCode,
  DollarSign
} from 'lucide-react';
import type { PaymentMethod, Product } from '../types';

interface CustomItemInput {
  name: string;
  price: number;
  quantity: number;
}

export const InvoiceForm: React.FC = () => {
  const {
    activeCustomer,
    activeItems,
    activePaymentMethod,
    setActiveCustomer,
    addActiveItem,
    removeActiveItem,
    updateActiveItemQty,
    updateActiveItemPrice,
    setActivePaymentMethod
  } = useInvoiceStore();

  const { products } = useProductStore();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Custom manual item input form
  const { register, handleSubmit, reset } = useForm<CustomItemInput>({
    defaultValues: {
      name: '',
      price: 15,
      quantity: 1
    }
  });

  const categories = ['All', 'Classic Tea', 'Specialty Tea', 'Iced Tea', 'Boba', 'Snacks'];

  const filteredQuickProducts = activeCategory === 'All'
    ? products
    : products.filter((p: Product) => p.category === activeCategory);

  // Handle customer input changes
  const handleCustomerChange = (field: 'name' | 'phone', val: string) => {
    setActiveCustomer({
      ...activeCustomer,
      [field]: val
    });
  };

  // Handle adding custom items
  const onSubmitCustomItem = (data: CustomItemInput) => {
    addActiveItem({
      id: Math.random().toString(36).substring(2, 9),
      name: data.name,
      category: 'Custom',
      price: Number(data.price),
      quantity: Number(data.quantity)
    });
    reset({ name: '', price: 15, quantity: 1 }); // reset manual entry
  };

  // Quick add product handler
  const handleQuickAdd = (product: Product) => {
    addActiveItem({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: 1
    });
  };

  const paymentModes: { id: PaymentMethod; label: string; icon: any }[] = [
    { id: 'cash', label: 'Cash', icon: DollarSign },
    { id: 'gpay', label: 'Google Pay', icon: QrCode },
    { id: 'phonepe', label: 'PhonePe', icon: QrCode },
    { id: 'paytm', label: 'Paytm', icon: CreditCard },
    { id: 'upi', label: 'Other UPI', icon: QrCode }
  ];

  return (
    <div className="space-y-6">
      
      {/* --- SECTION 1: CUSTOMER DETAILS --- */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-premium">
        <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-700" />
          Customer Information
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Customer Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Walk-in Customer"
                value={activeCustomer.name}
                onChange={(e) => handleCustomerChange('name', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 dark:text-zinc-100 placeholder:text-slate-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={activeCustomer.phone}
                onChange={(e) => handleCustomerChange('phone', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 dark:text-zinc-100 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: POS QUICK ITEMS GRID --- */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-premium">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-sm uppercase tracking-wider flex items-center gap-2">
            <Coffee className="w-4 h-4 text-emerald-700" />
            Quick Add Products
          </h4>
        </div>

        {/* Categories Tab bar */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
          {filteredQuickProducts.map((product: Product) => (
            <button
              key={product.id}
              onClick={() => handleQuickAdd(product)}
              className={`p-3 rounded-2xl border border-slate-150 dark:border-zinc-800/40 text-left transition-all duration-200 active:scale-95 flex flex-col justify-between h-20 shadow-sm`}
            >
              <span className="text-[11px] font-bold leading-snug line-clamp-2">
                {product.name}
              </span>
              <span className="text-xs font-extrabold block">
                {formatCurrency(product.price)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* --- SECTION 3: MANUAL ITEM ENTRY --- */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-premium">
        <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-emerald-700" />
          Custom Item Entry
        </h4>
        <form onSubmit={handleSubmit(onSubmitCustomItem)} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Item Name / Description
            </label>
            <input
              type="text"
              placeholder="e.g. Special Ginger Honey Lemon Tea"
              required
              {...register('name', { required: true })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 dark:text-zinc-100"
            />
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Price (INR)
            </label>
            <input
              type="number"
              step="0.01"
              required
              {...register('price', { required: true, min: 0 })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 dark:text-zinc-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Quantity
            </label>
            <input
              type="number"
              required
              {...register('quantity', { required: true, min: 1 })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 dark:text-zinc-100"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-emerald-700 text-white hover:bg-emerald-800 py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-700/10 flex items-center justify-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </form>
      </div>

      {/* --- SECTION 4: SELECTED ITEMS CART --- */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-premium">
        <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-emerald-700" />
          Active Cart Items ({activeItems.length})
        </h4>

        {activeItems.length > 0 ? (
          <div className="space-y-3">
            {/* Header row */}
            <div className="hidden sm:grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-850 pb-2 px-1">
              <span className="col-span-5">Item Name</span>
              <span className="col-span-2 text-center">Unit Price</span>
              <span className="col-span-3 text-center">Qty Controls</span>
              <span className="col-span-2 text-right">Subtotal</span>
            </div>

            {/* Cart Rows */}
            <div className="divide-y divide-slate-100 dark:divide-zinc-800/50 max-h-80 overflow-y-auto pr-1">
              {activeItems.map((item) => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 items-center py-4 gap-3 sm:gap-2 px-1 text-slate-700 dark:text-zinc-300">
                  
                  {/* Name and delete */}
                  <div className="sm:col-span-5 flex items-center gap-3">
                    <button
                      onClick={() => removeActiveItem(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                      {item.name}
                    </span>
                  </div>

                  {/* Price input (editable in line!) */}
                  <div className="sm:col-span-2 text-center flex justify-between sm:justify-center items-center gap-1.5">
                    <span className="sm:hidden text-[10px] text-slate-400 font-bold uppercase">Price: </span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateActiveItemPrice(item.id, Number(e.target.value))}
                      className="w-20 sm:w-16 px-2 sm:px-1.5 py-1.5 sm:py-0.5 text-xs text-center bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700"
                    />
                  </div>

                  {/* Qty incrementors */}
                  <div className="sm:col-span-3 flex justify-between sm:justify-center items-center gap-2">
                    <span className="sm:hidden text-[10px] text-slate-400 font-bold uppercase">Qty: </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateActiveItemQty(item.id, Math.max(item.quantity - 1, 1))}
                        className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-extrabold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateActiveItemQty(item.id, item.quantity + 1)}
                        className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Row subtotal */}
                  <div className="sm:col-span-2 text-right flex justify-between sm:block items-center">
                    <span className="sm:hidden text-[10px] text-slate-400 font-bold uppercase">Subtotal: </span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-100">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <ShoppingCart className="w-8 h-8 stroke-[1.5] mb-2" />
            <p className="text-xs">Your cart is empty. Click Quick Products or enter items above.</p>
          </div>
        )}
      </div>

      {/* --- SECTION 5: PAYMENT MODE --- */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-premium">
        <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-sm uppercase tracking-wider mb-4">
          Select Payment Method
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {paymentModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = activePaymentMethod === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActivePaymentMethod(mode.id)}
                className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2.5 font-bold text-xs transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-700/10'
                    : 'bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/80 hover:bg-slate-100 dark:hover:bg-zinc-700/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
