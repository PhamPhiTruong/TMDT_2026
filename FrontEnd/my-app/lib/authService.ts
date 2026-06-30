const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

// ─── Types ────────────────────────────────────────────────
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: string;
  isNewUser: boolean;
}

export interface ApiResponse<T = void> {
  code: number;
  message: string;
  data?: T;
}

// ─── Token helpers ────────────────────────────────────────
export const saveTokens = (access: string, refresh: string) => {
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentUser');
};

export const getAccessToken = (): string | null =>
  typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

// ─── API calls ────────────────────────────────────────────

/** Đăng ký tài khoản mới */
export async function registerUser(payload: {
  ho: string;
  ten: string;
  soDienThoai: string;
  email: string;
  matKhau: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body: ApiResponse = await res.json();
  if (!res.ok) throw new Error(body.message ?? 'Đăng ký thất bại');
}

/** Đăng nhập bằng email và mật khẩu */
export async function loginUser(payload: {
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
  return body.data!;
}

/** Đăng nhập Google - gửi authorization code lên backend */
export async function loginWithGoogle(code: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const body: ApiResponse<LoginResponse> = await res.json();
  if (!res.ok) throw new Error(body.message ?? 'Đăng nhập Google thất bại');
  return body.data!;
}

/** Tạo URL redirect đến trang đăng nhập Google */
export function getGoogleOAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
  const redirectUri =
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? 'http://localhost:3000/oauth2/redirect';

  const params = new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  redirectUri,
    response_type: 'code',
    scope:         'openid email profile',
    access_type:   'offline',
    prompt:        'select_account',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
