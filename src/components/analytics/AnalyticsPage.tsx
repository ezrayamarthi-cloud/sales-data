import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Globe2,
  DollarSign,
  Calendar,
  Layers,
} from 'lucide-react';
import type { MonthlyTrend, CategoryMetric, RegionMetric, ProductPerformance } from '../../types';

interface AnalyticsPageProps {
  monthlyTrends: MonthlyTrend[];
  categoryMetrics: CategoryMetric[];
  regionMetrics: RegionMetric[];
  productPerformances: ProductPerformance[];
}

const PALETTE = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#6366F1'];

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  monthlyTrends,
  categoryMetrics,
  regionMetrics,
  productPerformances,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'monthly' | 'yearly' | 'products' | 'regions'>('overview');

  // Yearly comparative data preparation (2025 vs 2026)
  const yearlyComparison = [
    { month: 'Jan', y2025: 18500, y2026: 34200 },
    { month: 'Feb', y2025: 22100, y2026: 39800 },
    { month: 'Mar', y2025: 26400, y2026: 44100 },
    { month: 'Apr', y2025: 29800, y2026: 48900 },
    { month: 'May', y2025: 31200, y2026: 52400 },
    { month: 'Jun', y2025: 35600, y2026: 58900 },
    { month: 'Jul', y2025: 33100, y2026: 56300 },
    { month: 'Aug', y2025: 36700, y2026: 61200 },
    { month: 'Sep', y2025: 39500, y2026: 64800 },
    { month: 'Oct', y2025: 42100, y2026: 68500 },
    { month: 'Nov', y2025: 45000, y2026: 72100 },
    { month: 'Dec', y2025: 48900, y2026: 76500 },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Subnav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Advanced Data Visualization & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Interactive multi-dimensional charts for sales volume, profitability, regional mix, and growth trends
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {[
            { id: 'overview', label: 'All Charts' },
            { id: 'monthly', label: 'Monthly' },
            { id: 'yearly', label: 'Yearly YoY' },
            { id: 'products', label: 'Product-Wise' },
            { id: 'regions', label: 'Regions' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart 1: Monthly Sales Analysis & Profit Margin (Area / Bar) */}
      {(activeTab === 'overview' || activeTab === 'monthly') && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Monthly Sales & Profit Margin Analysis
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly revenue volume, net gross profit, and order velocity
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Profit
              </span>
            </div>
          </div>

          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 15, right: 15, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="profit" name="Gross Profit" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 2: Yearly Sales Comparison (YoY 2025 vs 2026) */}
      {(activeTab === 'overview' || activeTab === 'yearly') && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Yearly Sales Comparison (YoY 2025 vs 2026)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparative month-over-month trajectory demonstrating revenue acceleration
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> FY2025
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> FY2026 (Accelerated)
              </span>
            </div>
          </div>

          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyComparison} margin={{ top: 15, right: 15, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="y2025"
                  name="2025 Revenue"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="y2026"
                  name="2026 Revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Grid: Product-Wise Sales & Category Revenue */}
      {(activeTab === 'overview' || activeTab === 'products') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product-Wise Sales Horizontal Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-700/60">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                Product-Wise Revenue Ranking
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Top revenue-generating catalog items
              </p>
            </div>

            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productPerformances.slice(0, 6)}
                  layout="vertical"
                  margin={{ top: 10, right: 15, left: 35, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    width={110}
                  />
                  <Tooltip
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="revenue" name="Total Revenue" fill="#6366F1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category-Wise Revenue Donut */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-amber-500" />
                  Category-Wise Revenue Share
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Revenue concentration across business verticals
                </p>
              </div>

              <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryMetrics}
                      dataKey="revenue"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                    >
                      {categoryMetrics.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={PALETTE[i % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
              {categoryMetrics.map((c, i) => (
                <div key={c.category} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                  />
                  <div className="truncate">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {c.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ${c.revenue.toLocaleString()} ({c.sharePercent}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chart 4: Region-Wise Sales & Profit Distribution */}
      {(activeTab === 'overview' || activeTab === 'regions') && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-600" />
                Region-Wise Sales & Contribution
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gross revenue compared to profit across international territories
              </p>
            </div>
          </div>

          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionMetrics} margin={{ top: 15, right: 15, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="revenue" name="Total Revenue" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                <Bar dataKey="profit" name="Gross Profit" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
