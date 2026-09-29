'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type Role = 'Admin' | 'Data Manager' | 'Salesman' | 'Program Previewer';

export type User = {
  id: string;
  name: string;
  role: Role;
  code: string;
  photoURL?: string;
  status?: 'online' | 'offline';
  allowedPages?: string[];
};

export type AuthUser = {
  id: string;
  name: string;
  role: Role;
  photoURL?: string;
  allowedPages?: string[];
};

export const DEFAULT_DEMO_ADMIN: AuthUser = {
  id: 'demo-admin',
  name: 'پیشاندەر (Demo Admin)',
  role: 'Admin',
  photoURL: '',
  allowedPages: [
    '/dashboard',
    '/sales',
    '/purchases',
    '/stock',
    '/products',
    '/customers',
    '/suppliers',
    '/expenses',
    '/tutorial',
    '/settings',
  ],
};

interface AuthContextType {
  user: AuthUser;
  isLoading: boolean;
  login: (name: string, code: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(DEFAULT_DEMO_ADMIN);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('authUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) {
          setUser(parsed);
        }
      } else {
        localStorage.setItem('authUser', JSON.stringify(DEFAULT_DEMO_ADMIN));
      }
    } catch (e) {
      console.warn('localStorage access failed in AuthProvider:', e);
    }
  }, []);

  // If user lands on /login, redirect directly to /dashboard for showcase
  useEffect(() => {
    if (pathname === '/login') {
      router.replace('/dashboard');
    }
  }, [pathname, router]);

  const switchRole = (role: Role) => {
    let allowedPages = [
      '/dashboard',
      '/sales',
      '/purchases',
      '/stock',
      '/products',
      '/customers',
      '/suppliers',
      '/expenses',
      '/tutorial',
      '/settings',
    ];
    if (role === 'Salesman') {
      allowedPages = ['/sales', '/customers', '/stock', '/tutorial'];
    } else if (role === 'Data Manager') {
      allowedPages = [
        '/dashboard',
        '/sales',
        '/purchases',
        '/stock',
        '/products',
        '/customers',
        '/suppliers',
        '/expenses',
        '/tutorial',
        '/settings',
      ];
    } else if (role === 'Program Previewer') {
      allowedPages = ['/dashboard', '/stock', '/products', '/tutorial'];
    }

    const updatedUser: AuthUser = {
      ...user,
      role,
      allowedPages,
    };
    setUser(updatedUser);
    try {
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
    } catch (e) {}
  };

  const login = async (name: string, code: string): Promise<boolean> => {
    // Zero-auth mode: Always logs in as requested name or Admin
    const loggedUser: AuthUser = {
      id: 'demo-' + (name || 'user'),
      name: name || DEFAULT_DEMO_ADMIN.name,
      role: 'Admin',
      allowedPages: DEFAULT_DEMO_ADMIN.allowedPages,
    };
    setUser(loggedUser);
    try {
      localStorage.setItem('authUser', JSON.stringify(loggedUser));
    } catch (e) {}
    router.push('/dashboard');
    return true;
  };

  const logout = () => {
    // In showcase mode, reset back to Demo Admin rather than locking user out
    setUser(DEFAULT_DEMO_ADMIN);
    try {
      localStorage.setItem('authUser', JSON.stringify(DEFAULT_DEMO_ADMIN));
    } catch (e) {}
    router.push('/dashboard');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
