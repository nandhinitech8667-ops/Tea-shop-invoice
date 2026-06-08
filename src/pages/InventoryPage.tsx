import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, AlertTriangle, Package, ToggleLeft, ToggleRight } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import AddEditProductModal from '../components/inventory/AddEditProductModal';
import type { Product, ProductCategory } from '../types';

const CATEGORIES: (ProductCategory | 'All')[] = ['All', 'Tea', 'Coffee', 'Snacks', 'Cool Drinks'];

const CATEGORY_COLORS: Record<string, string> = {
  Tea:           'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Coffee:        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Snacks:        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Cool Drinks': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
};

export default function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<ProductCategory | 'All'>('All');
  const [editingProduct, setEditingProduct] = useState<Product | null | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchCat = selectedCat === 'All' || p.category === selectedCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const lowStock = products.filter((p) => p.stock <= 5 && p.stock > 0);
  const outOfStock = products.filter((p) => p.stock === 0);

  const handleSave = (data: Omit<Product, 'id'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setEditingProduct(undefined);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{products.length} products total</p>
        </div>
        <button
          onClick={() => setEditingProduct(null)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 text-sm"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Alert Banners */}
      {outOfStock.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              {outOfStock.length} item{outOfStock.length > 1 ? 's' : ''} out of stock
            </p>
            <p className="text-xs text-red-500">{outOfStock.map((p) => p.name).join(', ')}</p>
          </div>
        </div>
      )}
      {lowStock.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
          <AlertTriangle size={18} className="text-orange-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
              {lowStock.length} item{lowStock.length > 1 ? 's' : ''} running low
            </p>
            <p className="text-xs text-orange-500">{lowStock.map((p) => `${p.name} (${p.stock} left)`).join(', ')}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedCat === cat
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Package size={48} className="mx-auto mb-3 opacity-30" />
          <p>No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const isLow = product.stock <= 5 && product.stock > 0;
            const isOut = product.stock === 0;
            return (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-28 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">{product.emoji}</span>
                  )}
                  {isOut && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                  {isLow && !isOut && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle size={10} /> Low
                    </span>
                  )}
                  {/* Category badge */}
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[product.category]}`}>
                    {product.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100 truncate">{product.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{product.price}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isOut ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      isLow ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                               'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      Stock: {product.stock}
                    </span>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 mt-3">
                    {/* Toggle available */}
                    <button
                      onClick={() => updateProduct(product.id, { available: !product.available })}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                    >
                      {product.available ? <ToggleRight size={14} className="text-emerald-500" /> : <ToggleLeft size={14} className="text-gray-400" />}
                      {product.available ? 'Active' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(product.id)}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {editingProduct !== undefined && (
        <AddEditProductModal
          product={editingProduct}
          onSave={handleSave}
          onClose={() => setEditingProduct(undefined)}
        />
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 text-center">
            <Trash2 size={40} className="mx-auto text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Delete Product?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This action cannot be undone.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300">Cancel</button>
              <button onClick={() => { deleteProduct(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
