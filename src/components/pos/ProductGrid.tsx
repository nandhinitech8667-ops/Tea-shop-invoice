import React, { memo } from 'react';
import { Plus, Package, AlertTriangle } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Tea':         'from-emerald-400 to-green-600',
  'Coffee':      'from-amber-400 to-amber-700',
  'Snacks':      'from-orange-400 to-red-500',
  'Cool Drinks': 'from-sky-400 to-blue-600',
};

const ProductGrid = memo(({ products, onAddToCart }: Props) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400">
        <Package size={40} className="mb-2 opacity-40" />
        <p className="text-sm">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {products.map((product) => {
        const isUnavailable = !product.available || product.stock === 0;
        const isLowStock = product.stock > 0 && product.stock <= 5;
        const gradient = CATEGORY_GRADIENTS[product.category] || 'from-gray-400 to-gray-600';

        return (
          <div
            key={product.id}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 ${
              isUnavailable ? 'opacity-50' : 'hover:shadow-lg hover:-translate-y-1 cursor-pointer group'
            }`}
          >
            {/* Product Image / Gradient Tile */}
            <div
              className={`relative h-24 bg-gradient-to-br ${gradient} flex items-center justify-center`}
              onClick={() => !isUnavailable && onAddToCart(product)}
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl drop-shadow-lg">{product.emoji}</span>
              )}

              {/* Badges */}
              {isUnavailable && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
              {isLowStock && !isUnavailable && (
                <div className="absolute top-1 right-1">
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <AlertTriangle size={10} />
                    Low
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-2.5">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-tight line-clamp-2 min-h-[2rem]">
                {product.name}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{product.price}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  Qty: {product.stock}
                </span>
              </div>
              <button
                onClick={() => !isUnavailable && onAddToCart(product)}
                disabled={isUnavailable}
                className={`mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isUnavailable
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95'
                }`}
              >
                <Plus size={12} />
                Add
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default ProductGrid;
