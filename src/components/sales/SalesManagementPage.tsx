import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  Printer,
  Trash2,
  Edit2,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import type { SaleRecord, Product, Customer } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SalesManagementPageProps {
  sales: SaleRecord[];
  products: Product[];
  customers: Customer[];
  onAddSale: (saleData: any) => Promise<boolean>;
  onEditSale: (id: string, saleData: any) => Promise<boolean>;
  onDeleteSale: (id: string) => Promise<boolean>;
  onUploadRecords: (records: any[], mode: 'append' | 'replace') => Promise<boolean>;
  onResetData: () => Promise<void>;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const SalesManagementPage: React.FC<SalesManagementPageProps> = ({
  sales,
  products,
  customers,
  onAddSale,
  onEditSale,
  onDeleteSale,
  onUploadRecords,
  onResetData,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Filters & Search
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'orderDate' | 'revenue' | 'profit' | 'quantity'>('orderDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Edit & Delete states
  const [editingSale, setEditingSale] = useState<SaleRecord | null>(null);
  const [deletingSaleId, setDeletingSaleId] = useState<string | null>(null);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'append' | 'replace'>('append');
  const [uploadPreview, setUploadPreview] = useState<any[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    productId: products[0]?.id || '',
    customerId: customers[0]?.id || '',
    quantity: 1,
    orderDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
    status: 'Completed',
  });

  // Filtered and sorted dataset
  const filteredSales = useMemo(() => {
    return sales
      .filter(s => {
        const q = search.toLowerCase();
        const matchesSearch =
          !search ||
          s.orderId.toLowerCase().includes(q) ||
          s.productName.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.region.toLowerCase().includes(q);

        const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
        const matchesRegion = regionFilter === 'All' || s.region === regionFilter;
        const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
        const matchesStartDate = !startDate || s.orderDate >= startDate;
        const matchesEndDate = !endDate || s.orderDate <= endDate;

        return matchesSearch && matchesCategory && matchesRegion && matchesStatus && matchesStartDate && matchesEndDate;
      })
      .sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'orderDate') {
          return a.orderDate.localeCompare(b.orderDate) * factor;
        }
        return (a[sortBy] - b[sortBy]) * factor;
      });
  }, [sales, search, categoryFilter, regionFilter, statusFilter, startDate, endDate, sortBy, sortOrder]);

  // Paginated view
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage) || 1;
  const currentRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSales.slice(start, start + itemsPerPage);
  }, [filteredSales, currentPage]);

  // Categories & Regions lists for select options
  const categoriesList = useMemo(() => Array.from(new Set(sales.map(s => s.category))), [sales]);
  const regionsList = useMemo(() => Array.from(new Set(sales.map(s => s.region))), [sales]);

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'Order Date',
      'Product Name',
      'Category',
      'Customer Name',
      'Region',
      'Quantity',
      'Unit Price',
      'Unit Cost',
      'Revenue',
      'Cost',
      'Profit',
      'Margin %',
      'Status',
      'Payment Method',
    ];

    const rows = filteredSales.map(s => [
      s.orderId,
      s.orderDate,
      `"${s.productName.replace(/"/g, '""')}"`,
      `"${s.category}"`,
      `"${s.customerName}"`,
      `"${s.region}"`,
      s.quantity,
      s.unitPrice,
      s.unitCost,
      s.revenue,
      s.cost,
      s.profit,
      s.marginPercent,
      s.status,
      s.paymentMethod,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Download Sample CSV Template
  const handleDownloadSampleCSV = () => {
    const template = `Order ID,Order Date,Product Name,Category,Customer Name,Region,Quantity,Unit Price,Unit Cost,Payment Method,Status
ORD-2026-9001,2026-11-10,OmniCloud Enterprise Suite,Cloud & Software,Acme Corp,North America,5,1200,320,Wire Transfer,Completed
ORD-2026-9002,2026-11-10,QuantumPro Workstation 16X,Electronics & Hardware,Delta Labs,Europe & UK,2,2450,1650,Credit Card,Completed`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sales_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Excel / CSV File Parsing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          setUploadError('The uploaded file contains no data rows.');
          return;
        }

        // Normalize rows to sales structure
        const mapped = data.map((row: any, idx) => ({
          orderId: row['Order ID'] || row['orderId'] || `IMP-${Date.now()}-${idx}`,
          orderDate: row['Order Date'] || row['orderDate'] || new Date().toISOString().split('T')[0],
          productName: row['Product Name'] || row['productName'] || 'General Product',
          category: row['Category'] || row['category'] || 'Electronics & Hardware',
          customerName: row['Customer Name'] || row['customerName'] || 'Direct Customer',
          region: row['Region'] || row['region'] || 'North America',
          quantity: Number(row['Quantity'] || row['quantity'] || 1),
          unitPrice: Number(row['Unit Price'] || row['unitPrice'] || 150),
          unitCost: Number(row['Unit Cost'] || row['unitCost'] || 75),
          paymentMethod: row['Payment Method'] || row['paymentMethod'] || 'Credit Card',
          status: row['Status'] || row['status'] || 'Completed',
        }));

        setUploadPreview(mapped);
        setUploadSuccess(`Successfully parsed ${mapped.length} sales records from ${file.name}!`);
      } catch (err: any) {
        setUploadError(`Failed to parse file: ${err.message || 'Check CSV/Excel format'}`);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleConfirmUpload = async () => {
    if (uploadPreview.length === 0) return;
    const ok = await onUploadRecords(uploadPreview, uploadMode);
    if (ok) {
      setIsUploadModalOpen(false);
      setUploadPreview([]);
      setUploadSuccess(null);
    }
  };

  // Handle Form Submission for Add
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onAddSale(formData);
    if (ok) {
      setIsAddModalOpen(false);
      // Reset form
      setFormData({
        productId: products[0]?.id || '',
        customerId: customers[0]?.id || '',
        quantity: 1,
        orderDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Credit Card',
        status: 'Completed',
      });
    }
  };

  // Handle Form Submission for Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSale) return;
    const ok = await onEditSale(editingSale.id, editingSale);
    if (ok) {
      setEditingSale(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Sales Data Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Create, search, filter, upload datasets, and generate custom exports ({filteredSales.length} records matching)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onResetData()}
            className="p-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
            title="Reset dataset back to factory 125 sample records"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Reset Factory Data</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Upload CSV/Excel</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sale Record</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Order ID, Product, Customer..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white"
            >
              <option value="All">All Categories ({categoriesList.length})</option>
              {categoriesList.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <select
              value={regionFilter}
              onChange={e => setRegionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white"
            >
              <option value="All">All Regions ({regionsList.length})</option>
              {regionsList.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Shipped">Shipped</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Secondary Date Range & Sort Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">Date Range:</span>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            />

            {(startDate || endDate || categoryFilter !== 'All' || regionFilter !== 'All' || statusFilter !== 'All' || search) && (
              <button
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('All');
                  setRegionFilter('All');
                  setStatusFilter('All');
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-2"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-2 py-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              <option value="orderDate">Date</option>
              <option value="revenue">Revenue</option>
              <option value="profit">Profit</option>
              <option value="quantity">Quantity</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
              className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-300"
            >
              {sortOrder.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Customer & Region</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right">Revenue</th>
                <th className="px-4 py-3 text-right">Profit</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No sales records found matching your filters.
                  </td>
                </tr>
              ) : (
                currentRecords.map(sale => (
                  <tr
                    key={sale.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-700/25 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                      {sale.orderId}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {sale.orderDate}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                        {sale.productName}
                      </div>
                      <div className="text-[10px] text-slate-400">{sale.category}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        {sale.customerName}
                      </div>
                      <div className="text-[10px] text-slate-400">{sale.region}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                      {sale.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                      ${sale.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">
                      ${sale.revenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        +${sale.profit.toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        ({sale.marginPercent}%)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          sale.status === 'Completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                            : sale.status === 'Shipped'
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
                            : sale.status === 'Pending'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                        }`}
                      >
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingSale(sale)}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingSaleId(sale.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title={isAdmin ? 'Delete transaction' : 'Admin privilege required'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredSales.length)} of {filteredSales.length}{' '}
            transactions
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= ADD SALE MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Record New Sales Transaction
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Product Selection
                </label>
                <select
                  value={formData.productId}
                  onChange={e => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  required
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.unitPrice} • Cost: ${p.unitCost} • {p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Customer & Region
                </label>
                <select
                  value={formData.customerId}
                  onChange={e => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  required
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company} • {c.region})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Units Sold (Quantity)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    value={formData.orderDate}
                    onChange={e => setFormData({ ...formData, orderDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="ACH">ACH Direct</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Order Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Calculated preview */}
              {(() => {
                const prod = products.find(p => p.id === formData.productId) || products[0];
                if (!prod) return null;
                const rev = prod.unitPrice * formData.quantity;
                const cost = prod.unitCost * formData.quantity;
                const prof = rev - cost;
                return (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-blue-700 dark:text-blue-300 block">
                        Calculated Deal Total:
                      </span>
                      <span className="text-base font-extrabold text-blue-900 dark:text-blue-100">
                        ${rev.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block">
                        Gross Margin:
                      </span>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        +${prof.toLocaleString()} ({Math.round((prof / rev) * 100)}%)
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT SALE MODAL ================= */}
      {editingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                Edit Transaction: {editingSale.orderId}
              </h2>
              <button
                onClick={() => setEditingSale(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingSale.productName}
                  onChange={e => setEditingSale({ ...editingSale, productName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingSale.quantity}
                    onChange={e =>
                      setEditingSale({ ...editingSale, quantity: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingSale.unitPrice}
                    onChange={e =>
                      setEditingSale({ ...editingSale, unitPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editingSale.status}
                    onChange={e => setEditingSale({ ...editingSale, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editingSale.orderDate}
                    onChange={e => setEditingSale({ ...editingSale, orderDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setEditingSale(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deletingSaleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Delete Sales Transaction?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Are you sure you want to delete this record? This action will update inventory counts and recalculated revenue stats.
            </p>

            {!isAdmin && (
              <div className="mt-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-[11px] text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                Note: In production, non-admin users cannot purge audit records. You can switch to Admin role via the top navbar.
              </div>
            )}

            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => setDeletingSaleId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onDeleteSale(deletingSaleId);
                  setDeletingSaleId(null);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CSV/EXCEL UPLOAD MODAL ================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                Upload Sales Dataset (CSV / Excel)
              </h2>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadPreview([]);
                  setUploadError(null);
                  setUploadSuccess(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Drag & drop dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 dark:border-indigo-800/80 rounded-2xl p-6 text-center hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Click to browse or drop CSV, XLS, or XLSX file here
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supported formats: .csv, .xlsx, .xls up to 25MB
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                />
              </div>

              {/* Sample template button */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">
                  Need the standard format template?
                </span>
                <button
                  type="button"
                  onClick={handleDownloadSampleCSV}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Sample CSV
                </button>
              </div>

              {/* Upload Mode selection */}
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Import Action Mode:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadMode('append')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      uploadMode === 'append'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold">Append to Existing</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Keep current dataset and add new rows
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('replace')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      uploadMode === 'replace'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold">Replace Dataset</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Overwrite database with uploaded records
                    </div>
                  </button>
                </div>
              </div>

              {/* Status alerts */}
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              {/* Preview table snippet */}
              {uploadPreview.length > 0 && (
                <div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preview (First 3 rows of {uploadPreview.length}):
                  </div>
                  <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2 font-mono text-[11px]">
                    {uploadPreview.slice(0, 3).map((r, i) => (
                      <div key={i} className="py-1 border-b border-slate-200 dark:border-slate-800 last:border-none">
                        {r.orderId} • {r.productName} • Qty {r.quantity} • ${r.unitPrice} • {r.region}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={uploadPreview.length === 0}
                  onClick={handleConfirmUpload}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold shadow-xs"
                >
                  Confirm & Import ({uploadPreview.length} rows)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
