import React from 'react';
import MainLayout from './layouts/MainLayout';
import { useInvoiceStore } from './store/useInvoiceStore';
import DashboardPage from './pages/DashboardPage';
import POSPage from './pages/POSPage';
import HistoryPage from './pages/HistoryPage';
import InventoryPage from './pages/InventoryPage';
import ReportsPage from './pages/ReportsPage';

export default function App() {
  const { currentPage } = useInvoiceStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':  return <DashboardPage />;
      case 'pos':        return <POSPage />;
      case 'history':    return <HistoryPage />;
      case 'inventory':  return <InventoryPage />;
      case 'reports':    return <ReportsPage />;
      default:           return <DashboardPage />;
    }
  };

  return (
    <MainLayout>
      {renderPage()}
    </MainLayout>
  );
}
