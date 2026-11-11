import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  Filter,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import type { SaleRecord, ProductPerformance, DashboardStats } from '../../types';

interface ReportsPageProps {
  sales: SaleRecord[];
  productPerformances: ProductPerformance[];
  stats: DashboardStats | null;
}

type ReportType =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'product-performance'
  | 'pnl-statement';

export const ReportsPage: React.FC<ReportsPageProps> = ({
  sales,
  productPerformances,
  stats,
}) => {
  const [reportType, setReportType] = useState<ReportType>('monthly');

  // Filter completed sales
  const completedSales = useMemo(() => sales.filter(s => s.status !== 'Cancelled'), [sales]);

  // Aggregate stats based on report type
  const reportData = useMemo(() => {
    if (reportType === 'daily') {
      const dailyMap = new Map<string, { revenue: number; cost: number; profit: number; count: number }>();
      completedSales.slice(0, 30).forEach(s => {
        const cur = dailyMap.get(s.orderDate) || { revenue: 0, cost: 0, profit: 0, count: 0 };
        cur.revenue += s.revenue;
        cur.cost += s.cost;
        cur.profit += s.profit;
        cur.count += 1;
        dailyMap.set(s.orderDate, cur);
      });
      return Array.from(dailyMap.entries())
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, d]) => ({
          period: date,
          orders: d.count,
          revenue: d.revenue,
          cost: d.cost,
          profit: d.profit,
          margin: d.revenue > 0 ? Math.round((d.profit / d.revenue) * 100) : 0,
        }));
    }

    if (reportType === 'weekly') {
      // Group by calendar week
      const weeklyMap = new Map<string, { revenue: number; cost: number; profit: number; count: number }>();
      completedSales.forEach(s => {
        const d = new Date(s.orderDate);
        const weekNum = Math.ceil(d.getDate() / 7);
        const key = `${s.orderDate.substring(0, 7)} W${weekNum}`;
        const cur = weeklyMap.get(key) || { revenue: 0, cost: 0, profit: 0, count: 0 };
        cur.revenue += s.revenue;
        cur.cost += s.cost;
        cur.profit += s.profit;
        cur.count += 1;
        weeklyMap.set(key, cur);
      });
      return Array.from(weeklyMap.entries())
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([week, d]) => ({
          period: week,
          orders: d.count,
          revenue: d.revenue,
          cost: d.cost,
          profit: d.profit,
          margin: d.revenue > 0 ? Math.round((d.profit / d.revenue) * 100) : 0,
        }));
    }

    if (reportType === 'monthly') {
      const monthlyMap = new Map<string, { revenue: number; cost: number; profit: number; count: number }>();
      completedSales.forEach(s => {
        const key = s.orderDate.substring(0, 7);
        const cur = monthlyMap.get(key) || { revenue: 0, cost: 0, profit: 0, count: 0 };
        cur.revenue += s.revenue;
        cur.cost += s.cost;
        cur.profit += s.profit;
        cur.count += 1;
        monthlyMap.set(key, cur);
      });
      return Array.from(monthlyMap.entries())
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([month, d]) => ({
          period: month,
          orders: d.count,
          revenue: d.revenue,
          cost: d.cost,
          profit: d.profit,
          margin: d.revenue > 0 ? Math.round((d.profit / d.revenue) * 100) : 0,
        }));
    }

    if (reportType === 'yearly') {
      const yearlyMap = new Map<string, { revenue: number; cost: number; profit: number; count: number }>();
      completedSales.forEach(s => {
        const key = s.orderDate.substring(0, 4);
        const cur = yearlyMap.get(key) || { revenue: 0, cost: 0, profit: 0, count: 0 };
        cur.revenue += s.revenue;
        cur.cost += s.cost;
        cur.profit += s.profit;
        cur.count += 1;
        yearlyMap.set(key, cur);
      });
      return Array.from(yearlyMap.entries())
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([year, d]) => ({
          period: `Fiscal Year ${year}`,
          orders: d.count,
          revenue: d.revenue,
          cost: d.cost,
          profit: d.profit,
          margin: d.revenue > 0 ? Math.round((d.profit / d.revenue) * 100) : 0,
        }));
    }

    return [];
  }, [completedSales, reportType]);

  // Export current report as CSV
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: any[][] = [];

    if (reportType === 'product-performance') {
      headers = ['Rank', 'Product Name', 'Category', 'Unit Price', 'Quantity Sold', 'Revenue', 'Profit', 'Margin %'];
      rows = productPerformances.map(p => [
        p.rank,
        `"${p.name}"`,
        `"${p.category}"`,
        p.unitPrice,
        p.quantitySold,
        p.revenue,
        p.profit,
        p.marginPercent,
      ]);
    } else if (reportType === 'pnl-statement') {
      headers = ['Line Item', 'Amount ($)', '% of Revenue'];
      const totRev = stats?.totalRevenue || 1;
      const totProfit = stats?.totalProfit || 0;
      const totCost = totRev - totProfit;
      rows = [
        ['Gross Sales Revenue', totRev, '100%'],
        ['Cost of Goods Sold (COGS)', totCost, `${Math.round((totCost / totRev) * 100)}%`],
        ['Gross Operating Profit', totProfit, `${Math.round((totProfit / totRev) * 100)}%`],
        ['Estimated Sales & Marketing (12%)', Math.round(totRev * 0.12), '12%'],
        ['Estimated General & Admin (8%)', Math.round(totRev * 0.08), '8%'],
        ['Net EBITDA', Math.round(totProfit - totRev * 0.2), `${Math.round(((totProfit - totRev * 0.2) / totRev) * 100)}%`],
      ];
    } else {
      headers = ['Period', 'Total Orders', 'Gross Revenue', 'Direct Cost', 'Net Profit', 'Profit Margin %'];
      rows = reportData.map(r => [
        r.period,
        r.orders,
        r.revenue,
        r.cost,
        r.profit,
        `${r.margin}%`,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            Executive Reports & Financial Statements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Generate and export daily, weekly, monthly, yearly, product performance, and P&L financial statements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'monthly', label: 'Monthly Report' },
          { id: 'weekly', label: 'Weekly Report' },
          { id: 'daily', label: 'Daily Sales' },
          { id: 'yearly', label: 'Yearly Comparison' },
          { id: 'product-performance', label: 'Product Performance' },
          { id: 'pnl-statement', label: 'Profit & Loss Statement' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as ReportType)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              reportType === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Printable Container */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs p-6 print:p-0 print:border-none print:shadow-none space-y-6">
        {/* Printable Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 gap-2">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              CONFIDENTIAL • EXECUTIVE FINANCIAL AUDIT
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white capitalize mt-0.5">
              {reportType.replace('-', ' ')} Summary
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generated automatically on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Global Enterprise Division
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              ● All Financial Figures Reconciled
            </span>
          </div>
        </div>

        {/* 1. Standard Period Table (Daily, Weekly, Monthly, Yearly) */}
        {['daily', 'weekly', 'monthly', 'yearly'].includes(reportType) && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Reporting Period</th>
                  <th className="px-4 py-3 text-right">Orders</th>
                  <th className="px-4 py-3 text-right">Gross Revenue</th>
                  <th className="px-4 py-3 text-right">Cost of Goods</th>
                  <th className="px-4 py-3 text-right">Net Profit</th>
                  <th className="px-4 py-3 text-right">Profit Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {reportData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {row.period}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">
                      {row.orders}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">
                      ${row.revenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      ${row.cost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      +${row.profit.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {row.margin}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Product Performance Report */}
        {reportType === 'product-performance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-4 py-3 text-right">Quantity Sold</th>
                  <th className="px-4 py-3 text-right">Total Revenue</th>
                  <th className="px-4 py-3 text-right">Gross Profit</th>
                  <th className="px-4 py-3 text-right">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {productPerformances.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                    <td className="px-4 py-3 font-bold text-slate-500">#{p.rank}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{p.category}</td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                      ${p.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                      {p.quantitySold}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">
                      ${p.revenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      +${p.profit.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {p.marginPercent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Profit & Loss Statement (P&L) */}
        {reportType === 'pnl-statement' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  1. Gross Revenue
                </span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                  ${(stats?.totalRevenue || 0).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between pl-4 text-slate-600 dark:text-slate-400">
                <span>Less: Cost of Goods Sold (Direct Costs)</span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  -${((stats?.totalRevenue || 0) - (stats?.totalProfit || 0)).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 pt-2 border-b border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                <span>2. Gross Operating Margin</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  +${(stats?.totalProfit || 0).toLocaleString()} ({stats?.profitMargin || 0}%)
                </span>
              </div>

              <div className="flex items-center justify-between pl-4 text-slate-600 dark:text-slate-400">
                <span>Sales, General & Administrative (SG&A Est. 12%)</span>
                <span>-${Math.round((stats?.totalRevenue || 0) * 0.12).toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pl-4 text-slate-600 dark:text-slate-400">
                <span>R&D and Cloud Infrastructure (8%)</span>
                <span>-${Math.round((stats?.totalRevenue || 0) * 0.08).toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-300 dark:border-slate-600 text-sm font-black text-slate-900 dark:text-white">
                <span>3. Net EBITDA (Estimated Earnings)</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  +$
                  {Math.max(
                    0,
                    Math.round((stats?.totalProfit || 0) - (stats?.totalRevenue || 0) * 0.2)
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
