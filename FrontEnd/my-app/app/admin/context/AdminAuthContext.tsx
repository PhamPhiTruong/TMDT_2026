'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { saveAdminTokens, clearAdminTokens } from '@/lib/adminAuthService';
import { LoginResponse } from '@/lib/authService';

interface AdminAuthUser {
  email: string;
  fullName: string;
  avatar?: string;
  role: string;
}

interface AdminAuthContextType {
  adminUser: AdminAuthUser | null;
  isAdminLoggedIn: boolean;
  adminLogin: (data: LoginResponse) => void;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const getInitialAdminUser = (): AdminAuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('adminCurrentUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminAuthUser | null>(() => getInitialAdminUser());

  const adminLogin = useCallback((data: LoginResponse) => {
    saveAdminTokens(data.accessToken, data.refreshToken);
    const authUser: AdminAuthUser = {
      email:    data.email,
      fullName: data.fullName,
      avatar:   data.avatar,
      role:     data.role,
    };
    localStorage.setItem('adminCurrentUser', JSON.stringify(authUser));
    setAdminUser(authUser);
  }, []);

  const adminLogout = useCallback(() => {
    clearAdminTokens();
    setAdminUser(null);
  }, []);

  return (
      <AdminAuthContext.Provider value={{ adminUser, isAdminLoggedIn: !!adminUser, adminLogin, adminLogout }}>
        {children}
      </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth phải dùng bên trong AdminAuthProvider');
  return ctx;
}
