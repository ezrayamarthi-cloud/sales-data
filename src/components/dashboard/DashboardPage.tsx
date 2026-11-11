import React from 'react';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  PackageCheck,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Download,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import type { DashboardStats, SaleRecord, ProductPerformance } from '../../types';
import { NavPage } from '../layout/Sidebar';

interface DashboardPageProps {
  stats: DashboardStats | null;
  sales: SaleRecord[];
  monthlyTrends: any[];
  categoryMetrics: any[];
  productPerformances: ProductPerformance[];
  onNavigate: (page: NavPage) => void;
  onOpenAddSaleModal: () => void;
}

const CATEGORY_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#6366F1'];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  sales,
  monthlyTrends,
  categoryMetrics,
  productPerformances,
  onNavigate,
  onOpenAddSaleModal,
}) => {
  const recentSales = sales.slice(0, 7);
  const topProducts = productPerformances.slice(0, 5);

  const kpis = [
    {
      title: 'Total Sales Revenue',
      value: stats ? `$${stats.totalRevenue.toLocaleString()}` : '$0',
      change: '+18.4%',
      isPositive: true,
      subtitle: 'vs previous year',
      icon: DollarSign,
      gradient: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-500/10',
    },
    {
      title: 'Total Gross Profit',
      value: stats ? `$${stats.totalProfit.toLocaleString()}` : '$0',
      change: `${stats?.profitMargin || 0}% margin`,
      isPositive: true,
      subtitle: 'healthy baseline',
      icon: TrendingUp,
      gradient: 'from-purple-600 to-indigo-600',
      shadow: 'shadow-purple-500/10',
    },
    {
      title: 'Total Completed Orders',
      value: stats ? stats.totalOrders.toLocaleString() : '0',
      change: '+12.6%',
      isPositive: true,
      subtitle: 'order fulfillment',
      icon: ShoppingBag,
      gradient: 'from-emerald-600 to-teal-600',
      shadow: 'shadow-emerald-500/10',
    },
    {
      title: 'Average Order Value',
      value: stats ? `$${stats.averageOrderValue.toLocaleString()}` : '$0',
      change: '+4.2%',
      isPositive: true,
      subtitle: 'per deal average',
      icon: CreditCard,
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/10',
    },
    {
      title: 'Active Catalog Products',
      value: stats ? stats.totalProducts.toString() : '0',
      change: '100% active',
      isPositive: true,
      subtitle: 'managed SKUs',
      icon: PackageCheck,
      gradient: 'from-cyan-600 to-blue-600',
      shadow: 'shadow-cyan-500/10',
    },
    {
      title: 'Sales Growth Rate',
      value: stats ? `${stats.salesGrowthPercentage}%` : '0%',
      change: `${stats?.salesGrowthPercentage && stats.salesGrowthPercentage >= 0 ? '+' : ''}${stats?.salesGrowthPercentage || 0}%`,
      isPositive: (stats?.salesGrowthPercentage || 0) >= 0,
      subtitle: 'month-over-month',
      icon: Calendar,
      gradient: 'from-violet-600 to-fuchsia-600',
      shadow: 'shadow-violet-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with AI Callout */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Sales Intelligence Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sales Performance & Predictive Analytics
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Monitor real-time revenue streams, analyze profitability across product lines, and leverage Google Gemini API for strategic executive forecasts.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('ai-insights')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white text-indigo-900 hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Generate AI Executive Report</span>
            </button>
            <button
              onClick={onOpenAddSaleModal}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            >
              + Record New Transaction
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export Reports</span>
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
          <div className="w-72 h-72 rounded-full bg-white blur-3xl -translate-y-12 translate-x-20"></div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${kpi.gradient} flex items-center justify-center text-white shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {kpi.value}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px]">
                  {kpi.isPositive ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                      <ArrowUpRight className="w-3 h-3" />
                      {kpi.change}
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center">
                      <ArrowDownRight className="w-3 h-3" />
                      {kpi.change}
                    </span>
                  )}
                  <span className="text-slate-400 dark:text-slate-500 truncate">
                    {kpi.subtitle}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue & Profit Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Revenue & Profit Growth Trajectory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly revenue compared with net gross margins
              </p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Full Deep Dive</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={val => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category-wise Revenue Distribution (1 Col) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Revenue by Category
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">Total Share</span>
            </div>

            <div className="h-56 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryMetrics}
                    dataKey="revenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {categoryMetrics.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: '10px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category breakdown legend list */}
          <div className="space-y-1.5 mt-2">
            {categoryMetrics.slice(0, 4).map((c, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                  />
                  <span className="text-slate-600 dark:text-slate-300 truncate">{c.category}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white shrink-0">
                  {c.sharePercent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Best-Selling Products & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Best-Selling Products */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Best-Selling Products Ranking
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Top revenue contributors and gross margin health
              </p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Catalog
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700/50">
                  <th className="pb-2 font-semibold">Rank</th>
                  <th className="pb-2 font-semibold">Product</th>
                  <th className="pb-2 font-semibold text-right">Units</th>
                  <th className="pb-2 font-semibold text-right">Revenue</th>
                  <th className="pb-2 font-semibold text-right">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                {topProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                    <td className="py-2.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          p.rank === 1
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                            : p.rank === 2
                            ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            : p.rank === 3
                            ? 'bg-amber-800/10 text-amber-900 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {p.rank}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{p.category}</div>
                    </td>
                    <td className="py-2.5 text-right font-medium text-slate-700 dark:text-slate-300">
                      {p.quantitySold}
                    </td>
                    <td className="py-2.5 text-right font-bold text-slate-900 dark:text-white">
                      ${p.revenue.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                        {p.marginPercent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Sales Transactions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest transactions across regions
              </p>
            </div>
            <button
              onClick={() => onNavigate('sales')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage All ({sales.length})
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-700/40">
            {recentSales.map(s => (
              <div
                key={s.id}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 px-1 rounded-lg"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                      {s.productName}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                      {s.orderId}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {s.customerName} • {s.region} • {s.orderDate}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    ${s.revenue.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    +${s.profit.toLocaleString()} ({s.marginPercent}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
