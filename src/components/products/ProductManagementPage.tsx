import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Tag,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  Layers,
  Award,
} from 'lucide-react';
import type { Product, ProductPerformance } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ProductManagementPageProps {
  products: Product[];
  productPerformances: ProductPerformance[];
  onAddProduct: (prod: any) => Promise<boolean>;
  onEditProduct: (id: string, prod: any) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<boolean>;
}

export const ProductManagementPage: React.FC<ProductManagementPageProps> = ({
  products,
  productPerformances,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Cloud & Software',
    unitPrice: 500,
    unitCost: 200,
    stock: 50,
    sku: '',
    description: '',
  });

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  // Merge products with performance stats
  const enrichedProducts = useMemo(() => {
    return products
      .map(p => {
        const perf = productPerformances.find(pf => pf.id === p.id || pf.name === p.name);
        return {
          ...p,
          quantitySold: perf?.quantitySold || 0,
          revenue: perf?.revenue || 0,
          profit: perf?.profit || 0,
          marginPercent: perf?.marginPercent || Math.round(((p.unitPrice - p.unitCost) / p.unitPrice) * 100),
          rank: perf?.rank || 999,
        };
      })
      .filter(p => {
        const matchesSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase());
        const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [products, productPerformances, search, selectedCategory]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onAddProduct({
      ...formData,
      sku: formData.sku || `SKU-${Date.now().toString().slice(-4)}`,
    });
    if (ok) {
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        category: 'Cloud & Software',
        unitPrice: 500,
        unitCost: 200,
        stock: 50,
        sku: '',
        description: '',
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const ok = await onEditProduct(editingProduct.id, editingProduct);
    if (ok) {
      setEditingProduct(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Product Catalog & Performance Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Catalog SKUs, unit economics, gross profit margins, inventory levels, and sales rankings
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products by name or SKU..."
            className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white"
          >
            <option value="All">All Categories ({categories.length})</option>
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrichedProducts.map(p => (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {p.sku}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5 leading-snug">
                    {p.name}
                  </h3>
                  <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    <Tag className="w-3 h-3" />
                    <span>{p.category}</span>
                  </div>
                </div>

                {p.rank <= 3 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                    <Award className="w-3 h-3 text-amber-500" />
                    Rank #{p.rank}
                  </span>
                )}
              </div>

              {p.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              )}

              {/* Pricing & Unit economics */}
              <div className="mt-4 grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Unit Price</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    ${p.unitPrice.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Unit Cost</span>
                  <span className="text-xs font-semibold text-slate-500">
                    ${p.unitCost.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Margin</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {p.marginPercent}%
                  </span>
                </div>
              </div>

              {/* Performance numbers */}
              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400">
                  Total Sold: <strong className="text-slate-800 dark:text-slate-200">{p.quantitySold} units</strong>
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  ${p.revenue.toLocaleString()} Rev
                </span>
              </div>
            </div>

            {/* Actions & Stock Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                Stock: <strong className="text-slate-700 dark:text-slate-300">{p.stock} units</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingProduct(p)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                  title="Edit product"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteProduct(p.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title={isAdmin ? 'Delete product' : 'Admin role required'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Add New Catalog Product
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Apex Enterprise Gateway 5G"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Cloud & Software">Cloud & Software</option>
                  <option value="Electronics & Hardware">Electronics & Hardware</option>
                  <option value="Office & Workspace">Office & Workspace</option>
                  <option value="Security & IoT">Security & IoT</option>
                  <option value="Consulting & Support">Consulting & Support</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Selling Price ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.unitPrice}
                    onChange={e =>
                      setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Direct Unit Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.unitCost}
                    onChange={e =>
                      setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={e =>
                      setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    SKU Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. SFT-PRO-09"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key features and target client use-case..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                Edit Product: {editingProduct.name}
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Selling Price ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.unitPrice}
                    onChange={e =>
                      setEditingProduct({
                        ...editingProduct,
                        unitPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Direct Unit Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.unitCost}
                    onChange={e =>
                      setEditingProduct({
                        ...editingProduct,
                        unitCost: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Stock Units
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingProduct.stock}
                  onChange={e =>
                    setEditingProduct({
                      ...editingProduct,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
