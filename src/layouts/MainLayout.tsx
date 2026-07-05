import { useState } from 'react';
import { LayoutDashboard, ShoppingCart, History, Package, BarChart3, Moon, Sun, Menu, X } from 'lucide-react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { useProductStore } from '../store/useProductStore';

interface Props {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'pos',        label: 'POS / Billing', icon: ShoppingCart },
  { id: 'history',    label: 'History',    icon: History },
  { id: 'inventory',  label: 'Inventory',  icon: Package },
  { id: 'reports',    label: 'Reports',    icon: BarChart3 },
] as const;

type Page = 'dashboard' | 'pos' | 'history' | 'inventory' | 'reports';

export default function MainLayout({ children }: Props) {
  const { currentPage, setCurrentPage, theme, toggleTheme, shopDetails } = useInvoiceStore();
  const { products } = useProductStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const lowStockCount = products.filter((p) => p.stock <= 5 && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const alertCount = lowStockCount + outOfStockCount;

  const handleNav = (page: Page) => {
    setCurrentPage(page);
    setMobileOpen(false);
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300`}>
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-56 xl:w-60 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-xl">🍵</span>
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm text-gray-900 dark:text-white truncate">{shopDetails.name}</p>
              <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">Brewing Happiness in Every Cup</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = currentPage === id;
            const showBadge = id === 'inventory' && alertCount > 0;
            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left relative ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={18} />
                {label}
                {showBadge && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {alertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <span className="text-base">🍵</span>
          </div>
          <span className="font-black text-gray-900 dark:text-white text-sm">{shopDetails.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-xl">🍵</span>
              </div>
              <div>
                <p className="font-black text-sm text-gray-900 dark:text-white">{shopDetails.name}</p>
                <p className="text-[9px] text-emerald-500">Brewing Happiness in Every Cup</p>
              </div>
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = currentPage === id;
                const showBadge = id === 'inventory' && alertCount > 0;
                return (
                  <button
                    key={id}
                    onClick={() => handleNav(id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                      isActive ? 'bg-emerald-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                    {showBadge && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {alertCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = currentPage === id;
          const showBadge = id === 'inventory' && alertCount > 0;
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors relative ${
                isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <Icon size={20} />
              <span className="hidden xs:block">{label.split(' ')[0]}</span>
              {showBadge && (
                <span className="absolute top-1 right-[25%] bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Main Content ── */}
      <main className="lg:ml-56 xl:ml-60 pt-16 lg:pt-0 pb-16 lg:pb-0 min-h-screen flex flex-col">
        <div className="flex-1 p-4 lg:p-6 max-w-screen-2xl mx-auto w-full">
          {children}
        </div>
        {/* Footer Watermark */}
        <footer className="w-full py-4 text-center border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Created by <span className="text-emerald-600 dark:text-emerald-400 font-bold">Nandhini Sakthi</span>
          </p>
        </footer>
      </main>
    </div>
  );
}
