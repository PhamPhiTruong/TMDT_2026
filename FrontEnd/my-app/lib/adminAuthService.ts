const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
import { LoginResponse, ApiResponse } from './authService';

// ─── Token helpers for Admin ────────────────────────────────
export const saveAdminTokens = (access: string, refresh: string) => {
  localStorage.setItem('adminAccessToken', access);
  localStorage.setItem('adminRefreshToken', refresh);
};

export const clearAdminTokens = () => {
  localStorage.removeItem('adminAccessToken');
  localStorage.removeItem('adminRefreshToken');
  localStorage.removeItem('adminCurrentUser');
};

export const getAdminAccessToken = (): string | null =>
  typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;

// ─── API calls ────────────────────────────────────────────

/** Đăng nhập dành cho Admin */
export async function loginAdmin(payload: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  const body: ApiResponse<LoginResponse> = await res.json();
  if (!res.ok) throw new Error(body.message ?? 'Đăng nhập thất bại');
  
  const data = body.data!;
  
  // Kiểm tra quyền (Bắt buộc phải là ADMIN)
  if (data.role !== 'ADMIN') {
    throw new Error('Bạn không có quyền quản trị (Yêu cầu tài khoản Admin)');
  }
  
  return data;
}

// ─── User Management API calls (Requires Admin Token) ──────
export interface UserAdminDTO {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  userAvatar: string;
  role: string;
  status: string;
  authProvider?: string;
}

export async function getAllUsers(): Promise<UserAdminDTO[]> {
  const token = getAdminAccessToken();
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const body: ApiResponse<UserAdminDTO[]> = await res.json();
  if (!res.ok) throw new Error(body.message ?? 'Lỗi khi lấy danh sách user');
  return body.data ?? [];
}

export async function updateUserStatus(userId: number, status: string): Promise<UserAdminDTO> {
  const token = getAdminAccessToken();
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}/status`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  const body: ApiResponse<UserAdminDTO> = await res.json();
  if (!res.ok) throw new Error(body.message ?? 'Lỗi khi cập nhật trạng thái');
  return body.data!;
}

export async function adminChangePassword(passwordData: { oldPassword: string; newPassword: string }): Promise<void> {
  const token = getAdminAccessToken();
  const res = await fetch(`${API_BASE}/api/v1/users/password`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(passwordData)
  });
  const body: ApiResponse = await res.json();
  if (!res.ok) throw new Error(body.message ?? 'Lỗi khi đổi mật khẩu');
}
