'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { LoginResponse, clearTokens, saveTokens } from '@/lib/authService';

interface AuthUser {
  email: string;
  fullName: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Khôi phục session từ localStorage khi app load
  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore parse error
    }
  }, []);

  const login = useCallback((data: LoginResponse) => {
    saveTokens(data.accessToken, data.refreshToken);
    const authUser: AuthUser = {
      email:    data.email,
      fullName: data.fullName,
      avatar:   data.avatar,
      role:     data.role,
    };
    localStorage.setItem('currentUser', JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng bên trong AuthProvider');
  return ctx;
}
