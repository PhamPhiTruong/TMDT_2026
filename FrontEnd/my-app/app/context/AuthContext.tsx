'use client';

import {
  createContext,
  useContext,
  useState,
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
  updateUser?: (updatedData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// 1. Hàm đọc dữ liệu từ localStorage (Đưa ra ngoài component để tối ưu và tránh lỗi SSR)
const getInitialUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// 2. Component Provider chính (Chỉ giữ lại duy nhất 1 định nghĩa hàm)
export function AuthProvider({ children }: { children: ReactNode }) {
  // Khởi tạo trực tiếp giá trị cho State từ localStorage lúc ứng dụng load
  const [user, setUser] = useState<AuthUser | null>(() => getInitialUser());

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
    localStorage.removeItem('currentUser'); // Thêm dòng này để xóa sạch dữ liệu localStorage khi logout
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedData: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  return (
      <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, updateUser }}>
        {children}
      </AuthContext.Provider>
  );
}

// 3. Custom Hook dùng để lấy dữ liệu auth ở các component khác
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng bên trong AuthProvider');
  return ctx;
}