import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  LineChart,
  Sparkles,
  FileSpreadsheet,
  Settings,
  Shield,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type NavPage =
  | 'dashboard'
  | 'sales'
  | 'products'
  | 'customers'
  | 'analytics'
  | 'ai-insights'
  | 'reports'
  | 'settings'
  | 'login'
  | 'register';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  salesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onCloseMobile,
  salesCount,
}) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard' as NavPage, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'sales' as NavPage, label: 'Sales Management', icon: ShoppingCart, badge: salesCount ? `${salesCount}` : null },
    { id: 'products' as NavPage, label: 'Product Catalog', icon: Package, badge: null },
    { id: 'customers' as NavPage, label: 'Customers & CRM', icon: Users, badge: null },
    { id: 'analytics' as NavPage, label: 'Visual Analytics', icon: LineChart, badge: 'Live' },
    { id: 'ai-insights' as NavPage, label: 'AI Intelligence', icon: Sparkles, badge: 'Gemini', isSpecial: true },
    { id: 'reports' as NavPage, label: 'Executive Reports', icon: FileSpreadsheet, badge: null },
    { id: 'settings' as NavPage, label: 'System & Architecture', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-68 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo & Title */}
        <div className="h-16 flex items-center px-5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              SalesIQ <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">PRO</span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Enterprise Intelligence</span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Platform Navigation
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? item.isSpecial
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : item.isSpecial
                    ? 'text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'text-white'
                        : item.isSpecial
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.isSpecial
                        ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Architecture & Tech Stack Card */}
          <div className="pt-4 px-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-slate-800/60 dark:to-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Backend & Database</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Spring Boot 3.2 + MySQL 8.0 DDL & Gemini 3.8 Flash models.
              </p>
              <button
                onClick={() => {
                  onNavigate('settings');
                  onCloseMobile();
                }}
                className="w-full text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center justify-between pt-1"
              >
                <span>View Architecture</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user?.name || 'Guest User'}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <Shield className="w-2.5 h-2.5 text-emerald-500" />
                <span className="capitalize">{user?.role || 'Guest'}</span>
                <span>•</span>
                <span className="truncate">{user?.department || 'Operations'}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
