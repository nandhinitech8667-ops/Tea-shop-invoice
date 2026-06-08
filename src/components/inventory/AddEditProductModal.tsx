import React, { useState } from 'react';
import { X, Save, Upload } from 'lucide-react';
import type { Product, ProductCategory } from '../../types';

const CATEGORIES: ProductCategory[] = ['Tea', 'Coffee', 'Snacks', 'Cool Drinks'];

const EMOJIS: Record<ProductCategory, string[]> = {
  Tea:          ['🍵', '🫚', '🌿', '🍋', '🍃', '☕', '🫖', '✨'],
  Coffee:       ['☕', '🥤', '⬛', '🫙'],
  Snacks:       ['🥟', '🍩', '🫓', '🟤', '🥐', '🥪', '🌯', '🍰', '🍪'],
  'Cool Drinks':['🍋', '💧', '🥤', '🍹'],
};

interface Props {
  product?: Product | null;
  onSave: (product: Omit<Product, 'id'>) => void;
  onClose: () => void;
}

export default function AddEditProductModal({ product, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Product, 'id'>>({
    name: product?.name ?? '',
    category: product?.category ?? 'Tea',
    price: product?.price ?? 0,
    stock: product?.stock ?? 50,
    imageUrl: product?.imageUrl ?? '',
    emoji: product?.emoji ?? '🍵',
    available: product?.available ?? true,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, imageUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.price <= 0) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <span className="font-bold">{product ? 'Edit Product' : 'Add New Product'}</span>
          <button onClick={onClose} className="hover:opacity-70"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Image Upload */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Product Image</label>
            <div className="flex gap-3 items-center">
              <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">{form.emoji}</span>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 transition-colors">
                  <Upload size={14} />
                  Upload Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <p className="text-[10px] text-gray-400 mt-1">Or choose an emoji below</p>
              </div>
            </div>

            {/* Emoji Picker */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {EMOJIS[form.category].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, emoji, imageUrl: '' }))}
                  className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all ${
                    form.emoji === emoji && !form.imageUrl
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 ring-2 ring-emerald-500'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Special Masala Chai"
              required
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Category *</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, category: cat, emoji: EMOJIS[cat][0] }))}
                  className={`py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                    form.category === cat
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Price (₹) *</label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Stock Qty</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Available toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Available</p>
              <p className="text-xs text-gray-400">Show this product in POS</p>
            </div>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, available: !f.available }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.available ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.available ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Save size={15} />
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
