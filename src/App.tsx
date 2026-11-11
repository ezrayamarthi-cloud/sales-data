import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar, NavPage } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { SalesManagementPage } from './components/sales/SalesManagementPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { AiInsightsPage } from './components/ai/AiInsightsPage';
import { ProductManagementPage } from './components/products/ProductManagementPage';
import { CustomerManagementPage } from './components/customers/CustomerManagementPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { AuthPage } from './components/auth/AuthPage';

import type {
  SaleRecord,
  Product,
  Customer,
  DashboardStats,
  AiAnalysisResult,
  ProductPerformance,
} from './types';

function MainApp() {
  const { user, isAuthenticated } = useAuth();

  // Navigation state
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isAddSaleModalOpen, setIsAddSaleModalOpen] = useState(false);

  // Core Data Stores
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Analytics derived metrics
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [categoryMetrics, setCategoryMetrics] = useState<any[]>([]);
  const [regionMetrics, setRegionMetrics] = useState<any[]>([]);
  const [productPerformances, setProductPerformances] = useState<ProductPerformance[]>([]);

  // AI Insights result
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch all core application data
  const loadData = useCallback(async () => {
    try {
      setDataLoading(true);
      const [salesRes, prodRes, custRes, statsRes, analyticsRes] = await Promise.all([
        fetch('/api/sales'),
        fetch('/api/products'),
        fetch('/api/customers'),
        fetch('/api/dashboard/stats'),
        fetch('/api/analytics/overview'),
      ]);

      const salesData = await salesRes.json();
      const prodData = await prodRes.json();
      const custData = await custRes.json();
      const statsData = await statsRes.json();
      const analyticsData = await analyticsRes.json();

      setSales(salesData.sales || []);
      setProducts(prodData || []);
      setCustomers(custData || []);
      setStats(statsData || null);

      if (analyticsData) {
        setMonthlyTrends(analyticsData.monthlyTrends || []);
        setCategoryMetrics(analyticsData.categoryMetrics || []);
        setRegionMetrics(analyticsData.regionMetrics || []);
        setProductPerformances(analyticsData.productPerformances || []);
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Run AI analysis
  const fetchAiAnalysis = useCallback(async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/analyze', { method: 'POST' });
      const data = await res.json();
      setAiAnalysis(data);
    } catch (err) {
      console.error('Failed to run AI analysis:', err);
    } finally {
      setAiLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    fetchAiAnalysis();
  }, [loadData, fetchAiAnalysis]);

  // Sales CRUD
  const handleAddSale = async (formData: any) => {
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await loadData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleEditSale = async (id: string, formData: any) => {
    try {
      const res = await fetch(`/api/sales/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await loadData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleDeleteSale = async (id: string) => {
    try {
      const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleUploadRecords = async (records: any[], mode: 'append' | 'replace') => {
    try {
      const res = await fetch('/api/sales/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records, mode }),
      });
      if (res.ok) {
        await loadData();
        fetchAiAnalysis();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleResetData = async () => {
    try {
      await fetch('/api/sales/reset', { method: 'POST' });
      await loadData();
      await fetchAiAnalysis();
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  // Product CRUD
  const handleAddProduct = async (prodData: any) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prodData),
      });
      if (res.ok) {
        await loadData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleEditProduct = async (id: string, prodData: any) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prodData),
      });
      if (res.ok) {
        await loadData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Customer Add
  const handleAddCustomer = async (custData: any) => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(custData),
      });
      if (res.ok) {
        await loadData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // If not authenticated or on auth screens
  if (!isAuthenticated || currentPage === 'login' || currentPage === 'register') {
    return (
      <AuthPage
        initialMode={currentPage === 'register' ? 'register' : 'login'}
        onSuccess={() => setCurrentPage('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        salesCount={sales.length}
      />

      {/* Main Content Area */}
      <div className="lg:pl-68 flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          onNavigate={setCurrentPage}
          onOpenAddSaleModal={() => {
            setCurrentPage('sales');
            setIsAddSaleModalOpen(true);
          }}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && (
            <DashboardPage
              stats={stats}
              sales={sales}
              monthlyTrends={monthlyTrends}
              categoryMetrics={categoryMetrics}
              productPerformances={productPerformances}
              onNavigate={setCurrentPage}
              onOpenAddSaleModal={() => {
                setCurrentPage('sales');
                setIsAddSaleModalOpen(true);
              }}
            />
          )}

          {currentPage === 'sales' && (
            <SalesManagementPage
              sales={sales}
              products={products}
              customers={customers}
              onAddSale={handleAddSale}
              onEditSale={handleEditSale}
              onDeleteSale={handleDeleteSale}
              onUploadRecords={handleUploadRecords}
              onResetData={handleResetData}
              isAddModalOpen={isAddSaleModalOpen}
              setIsAddModalOpen={setIsAddSaleModalOpen}
            />
          )}

          {currentPage === 'analytics' && (
            <AnalyticsPage
              monthlyTrends={monthlyTrends}
              categoryMetrics={categoryMetrics}
              regionMetrics={regionMetrics}
              productPerformances={productPerformances}
            />
          )}

          {currentPage === 'ai-insights' && (
            <AiInsightsPage
              aiAnalysis={aiAnalysis}
              loading={aiLoading}
              onRefreshAnalysis={fetchAiAnalysis}
            />
          )}

          {currentPage === 'products' && (
            <ProductManagementPage
              products={products}
              productPerformances={productPerformances}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {currentPage === 'customers' && (
            <CustomerManagementPage
              customers={customers}
              onAddCustomer={handleAddCustomer}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsPage
              sales={sales}
              productPerformances={productPerformances}
              stats={stats}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage onResetData={handleResetData} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
