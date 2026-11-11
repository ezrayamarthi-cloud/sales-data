import React, { useState } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Search,
  Plus,
  Sparkles,
  LogOut,
  UserCheck,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { NavPage } from './Sidebar';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onNavigate: (page: NavPage) => void;
  onOpenAddSaleModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  onNavigate,
  onOpenAddSaleModal,
  searchQuery,
  onSearchChange,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, switchRole } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              onSearchChange(e.target.value);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                onNavigate('sales');
              }
            }}
            placeholder="Search orders, products, customers, regions... (Press Enter)"
            className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all"
          />
          <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
            ↵
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Theme, Role, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Sale button */}
        <button
          onClick={onOpenAddSaleModal}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Sale</span>
        </button>

        {/* AI Analysis shortcut */}
        <button
          onClick={() => onNavigate('ai-insights')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>AI Insight</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Role & User dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  user?.role === 'admin'
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                {user?.role || 'Guest'}
              </span>
            </div>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onClick={() => setProfileDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/60">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.email}
                </p>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                  {user?.role === 'admin' ? 'Administrator' : 'Standard Analyst'}
                </div>
              </div>

              {/* Role switcher for testing */}
              <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="text-[10px] uppercase font-bold tracking-wider block mb-1">
                  Active Role (RBAC)
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      switchRole('admin');
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                      user?.role === 'admin'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <ShieldAlert className="w-3 h-3" />
                    Admin
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      switchRole('user');
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                      user?.role === 'user'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <UserCheck className="w-3 h-3" />
                    User
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700/60 mt-1 pt-1">
                <button
                  onClick={() => onNavigate('settings')}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                >
                  System & Database Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
