import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useInvoiceStore } from '../store/useInvoiceStore';
import CategoryFilter from '../components/pos/CategoryFilter';
import ProductGrid from '../components/pos/ProductGrid';
import CartPanel from '../components/pos/CartPanel';
import PaymentModal from '../components/payments/PaymentModal';
import type { Product, ProductCategory } from '../types';

export default function POSPage() {
  const { products } = useProductStore();
  const { addActiveItem } = useInvoiceStore();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [search, setSearch] = useState('');
  const [mobileTab, setMobileTab] = useState<'products' | 'cart'>('products');

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && p.available;
  });

  const handleAddToCart = useCallback((product: Product) => {
    addActiveItem({
      id: product.id,
      name: product.name,
      category: product.category,
      quantity: 1,
      price: product.price,
    });
    // On mobile, switch to cart view on first add
    setMobileTab('cart');
  }, [addActiveItem]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim() !== '') {
      if (filtered.length > 0) {
        handleAddToCart(filtered[0]);
        setSearch('');
      }
    }
  };

  return (
    <>
      {/* ── Desktop layout: two-column ── */}
      <div className="hidden lg:flex gap-5 h-[calc(100vh-120px)]">
        {/* Left: Products */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products (Press Enter to add quick)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>

          {/* Category Filter */}
          <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />

          {/* Product Grid - scrollable */}
          <div className="flex-1 overflow-y-auto">
            <ProductGrid products={filtered} onAddToCart={handleAddToCart} />
          </div>
        </div>

        {/* Right: Cart */}
        <div className="w-80 xl:w-96 flex-shrink-0">
          <CartPanel />
        </div>
      </div>

      {/* ── Mobile layout: tabs ── */}
      <div className="lg:hidden flex flex-col gap-4 h-[calc(100vh-160px)]">
        {/* Tab buttons */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setMobileTab('products')}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              mobileTab === 'products'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            🍽️ Products
          </button>
          <button
            onClick={() => setMobileTab('cart')}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              mobileTab === 'cart'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            🛒 Cart
          </button>
        </div>

        {mobileTab === 'products' && (
          <div className="flex flex-col gap-3 flex-1 overflow-hidden">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products (Press Enter to add quick)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
            <div className="flex-1 overflow-y-auto">
              <ProductGrid products={filtered} onAddToCart={handleAddToCart} />
            </div>
          </div>
        )}

        {mobileTab === 'cart' && (
          <div className="flex-1 overflow-hidden">
            <CartPanel />
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal />
    </>
  );
}
