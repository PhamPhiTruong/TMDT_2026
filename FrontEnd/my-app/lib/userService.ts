import { getAccessToken } from './authService';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export interface UserProfile {
  userId: number;
  email: string;
  fullName: string;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  avatar: string | null;
  status: string;
  authProvider?: string;
}

export interface UpdateProfileData {
  fullName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(url, { ...options, headers });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.message || 'Lỗi kết nối đến máy chủ');
  }
  return body;
}

export async function getUserProfile(): Promise<UserProfile> {
  const data = await fetchWithAuth(`${API_BASE}/api/v1/users/profile`, { method: 'GET' });
  return data.data;
}

export async function updateUserProfile(profileData: UpdateProfileData): Promise<UserProfile> {
  const data = await fetchWithAuth(`${API_BASE}/api/v1/users/profile`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  return data.data;
}

export async function changePassword(passwordData: ChangePasswordData): Promise<void> {
  await fetchWithAuth(`${API_BASE}/api/v1/users/password`, {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  });
}
