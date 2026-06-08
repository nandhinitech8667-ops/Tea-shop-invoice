import { create } from 'zustand';
import type { Product, ProductCategory } from '../types';

// ─── Default Products ─────────────────────────────────────────────────────────

const DEFAULT_PRODUCTS: Product[] = [
  // Tea
  { id: 'p1',  name: 'Milk Tea',       category: 'Tea', price: 20, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop', emoji: '🍵', available: true },
  { id: 'p2',  name: 'Ginger Tea',     category: 'Tea', price: 25, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1576092762791-dd9e2220abd4?w=300&h=300&fit=crop', emoji: '🫚', available: true },
  { id: 'p3',  name: 'Cardamom Tea',   category: 'Tea', price: 25, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=300&h=300&fit=crop', emoji: '🌿', available: true },
  { id: 'p4',  name: 'Lemon Tea',      category: 'Tea', price: 20, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1578160112054-954a67602b88?w=300&h=300&fit=crop', emoji: '🍋', available: true },
  { id: 'p5',  name: 'Green Tea',      category: 'Tea', price: 30, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1627492275512-404fb9ebaf0c?w=300&h=300&fit=crop', emoji: '🍃', available: true },
  { id: 'p6',  name: 'Black Tea',      category: 'Tea', price: 20, stock: 60, imageUrl: 'https://images.unsplash.com/photo-1594916982635-f48937996c14?w=300&h=300&fit=crop', emoji: '☕', available: true },
  { id: 'p7',  name: 'Masala Tea',     category: 'Tea', price: 20, stock: 60, imageUrl: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=300&h=300&fit=crop', emoji: '🫖', available: true },
  { id: 'p8',  name: 'Special Tea',    category: 'Tea', price: 35, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1606757659560-6923b72381e4?w=300&h=300&fit=crop', emoji: '✨', available: true },
  // Coffee
  { id: 'p9',  name: 'Filter Coffee',  category: 'Coffee', price: 30, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=300&h=300&fit=crop', emoji: '☕', available: true },
  { id: 'p10', name: 'Cappuccino',     category: 'Coffee', price: 60, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1534687941688-1b2b3d328325?w=300&h=300&fit=crop', emoji: '☕', available: true },
  { id: 'p11', name: 'Cold Coffee',    category: 'Coffee', price: 50, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop', emoji: '🥤', available: true },
  { id: 'p12', name: 'Espresso',       category: 'Coffee', price: 50, stock: 35, imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300&h=300&fit=crop', emoji: '⬛', available: true },
  // Snacks
  { id: 'p13', name: 'Samosa',         category: 'Snacks', price: 15, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop', emoji: '🥟', available: true },
  { id: 'p14', name: 'Vada',           category: 'Snacks', price: 15, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&h=300&fit=crop', emoji: '🍩', available: true },
  { id: 'p15', name: 'Bajji',          category: 'Snacks', price: 20, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1604085449293-167812be6dd3?w=300&h=300&fit=crop', emoji: '🫓', available: true },
  { id: 'p16', name: 'Bonda',          category: 'Snacks', price: 15, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1589301773950-89196bcf2918?w=300&h=300&fit=crop', emoji: '🟤', available: true },
  { id: 'p17', name: 'Puffs',          category: 'Snacks', price: 25, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548f?w=300&h=300&fit=crop', emoji: '🥐', available: true },
  { id: 'p18', name: 'Sandwich',       category: 'Snacks', price: 50, stock: 15, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop', emoji: '🥪', available: true },
  { id: 'p19', name: 'Veg Roll',       category: 'Snacks', price: 50, stock: 15, imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&h=300&fit=crop', emoji: '🌯', available: true },
  { id: 'p20', name: 'Cake Slice',     category: 'Snacks', price: 60, stock: 10, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop', emoji: '🍰', available: true },
  { id: 'p21', name: 'Biscuit Pack',   category: 'Snacks', price: 30, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop', emoji: '🍪', available: true },
  // Cool Drinks
  { id: 'p22', name: 'Lemon Juice',    category: 'Cool Drinks', price: 30, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300&h=300&fit=crop', emoji: '🍋', available: true },
  { id: 'p23', name: 'Water Bottle',   category: 'Cool Drinks', price: 20, stock: 100, imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=300&fit=crop', emoji: '💧', available: true },
  { id: 'p24', name: 'Soft Drinks',    category: 'Cool Drinks', price: 40, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=300&fit=crop', emoji: '🥤', available: true },
  { id: 'p25', name: 'Fresh Juice',    category: 'Cool Drinks', price: 60, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=300&fit=crop', emoji: '🍹', available: true },
];

// ─── Store Interface ──────────────────────────────────────────────────────────

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  decrementStock: (id: string, qty: number) => void;
  incrementStock: (id: string, qty: number) => void;
  getLowStockProducts: () => Product[];
  getProductsByCategory: (category: ProductCategory | 'All') => Product[];
}

function saveProducts(products: Product[]) {
  localStorage.setItem('ts_products', JSON.stringify(products));
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useProductStore = create<ProductState>((set, get) => {
  const saved = localStorage.getItem('ts_products');
  let initialProducts: Product[] = saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;

  // Migration: update empty image URLs with new default ones
  initialProducts = initialProducts.map(p => {
    if (!p.imageUrl) {
      const dp = DEFAULT_PRODUCTS.find(defaultP => defaultP.id === p.id);
      if (dp && dp.imageUrl) {
        return { ...p, imageUrl: dp.imageUrl };
      }
    }
    return p;
  });

  return {
    products: initialProducts,

    addProduct: (product) => {
      set((state) => {
        const newProduct: Product = {
          ...product,
          id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
        };
        const updated = [...state.products, newProduct];
        saveProducts(updated);
        return { products: updated };
      });
    },

    updateProduct: (id, updates) => {
      set((state) => {
        const updated = state.products.map((p) => (p.id === id ? { ...p, ...updates } : p));
        saveProducts(updated);
        return { products: updated };
      });
    },

    deleteProduct: (id) => {
      set((state) => {
        const updated = state.products.filter((p) => p.id !== id);
        saveProducts(updated);
        return { products: updated };
      });
    },

    decrementStock: (id, qty) => {
      set((state) => {
        const updated = state.products.map((p) => {
          if (p.id !== id) return p;
          const newStock = Math.max(0, p.stock - qty);
          return { ...p, stock: newStock, available: newStock > 0 };
        });
        saveProducts(updated);
        return { products: updated };
      });
    },

    incrementStock: (id, qty) => {
      set((state) => {
        const updated = state.products.map((p) => {
          if (p.id !== id) return p;
          return { ...p, stock: p.stock + qty, available: true };
        });
        saveProducts(updated);
        return { products: updated };
      });
    },

    getLowStockProducts: () => {
      return get().products.filter((p) => p.stock <= 5 && p.stock > 0);
    },

    getProductsByCategory: (category) => {
      if (category === 'All') return get().products;
      return get().products.filter((p) => p.category === category);
    }
  };
});
