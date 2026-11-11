import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, role: Role, department?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: Role) => void;
  loading: boolean;
}

const defaultAdminUser: User = {
  id: 'usr-admin-1',
  name: 'Alex Mercer',
  email: 'admin@salesanalytics.com',
  role: 'admin',
  department: 'Executive Leadership',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  token: 'mock-jwt-admin-token',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultAdminUser;
      }
    }
    return defaultAdminUser;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const login = async (email: string, password = 'password') => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch {
      // Fallback local auth
      const isAdmin = email.toLowerCase().includes('admin');
      const fallbackUser: User = {
        id: `usr-${Date.now()}`,
        name: isAdmin ? 'Alex Mercer (Admin)' : 'Jordan Taylor (Analyst)',
        email,
        role: isAdmin ? 'admin' : 'user',
        department: 'Sales Intelligence',
        token: 'local-token',
      };
      setUser(fallbackUser);
      return true;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, role: Role, department?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, department }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch {
      const fallbackUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        department: department || 'Sales Analytics',
      };
      setUser(fallbackUser);
      return true;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: Role) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
