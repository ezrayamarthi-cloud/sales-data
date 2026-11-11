import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, UserCheck, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../types';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onSuccess }) => {
  const { login, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('user');
  const [department, setDepartment] = useState('Sales Intelligence');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      const ok = await login(email, password);
      if (ok) {
        onSuccess();
      } else {
        setError('Invalid credentials. Please verify your email.');
      }
    } else {
      if (!name || !email) {
        setError('Please provide your name and email');
        return;
      }
      const ok = await register(name, email, role, department);
      if (ok) {
        onSuccess();
      } else {
        setError('Failed to create account. Please try again.');
      }
    }
  };

  // Demo one-click sign in
  const handleQuickLogin = async (userType: 'admin' | 'user') => {
    if (userType === 'admin') {
      await login('admin@salesanalytics.com', 'admin123');
    } else {
      await login('analyst@salesanalytics.com', 'analyst123');
    }
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/25">
          <TrendingUp className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isLogin ? 'Sign in to SalesIQ Pro' : 'Create your Enterprise Account'}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          AI-Powered Sales Analytics & Visual Forecasting Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-xl border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6">
          {/* Quick Demo Logins Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50/50 dark:from-indigo-950/40 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Instant One-Click Demo Access:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('user')}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Analyst Login</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold tracking-wider">
                Or continue with credentials
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {!isLogin && (
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="analyst@enterprise.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as Role)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="user">Sales User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="Sales Analytics"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {isLogin
                ? "Don't have an account? Register here"
                : 'Already registered? Sign in instead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
