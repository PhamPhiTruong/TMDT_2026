'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { registerUser, getGoogleOAuthUrl } from '@/lib/authService';

interface FormData {
  ho: string;
  ten: string;
  soDienThoai: string;
  email: string;
  matKhau: string;
  xacNhanMatKhau: string;
}

interface FormErrors {
  ho?: string;
  ten?: string;
  soDienThoai?: string;
  email?: string;
  matKhau?: string;
  xacNhanMatKhau?: string;
  general?: string;
}

const inputClass = (error?: string) =>
  `w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 ${
    error
      ? 'border-danger bg-red-50 focus:border-danger focus:ring-2 focus:ring-red-100'
      : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-green-100'
  }`;

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    ho: '', ten: '', soDienThoai: '', email: '', matKhau: '', xacNhanMatKhau: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const setField =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.ho.trim()) e.ho = 'Vui lòng nhập họ';
    if (!form.ten.trim()) e.ten = 'Vui lòng nhập tên';
    if (!form.soDienThoai.trim()) {
      e.soDienThoai = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0|\+84)[0-9]{9}$/.test(form.soDienThoai.replace(/\s/g, ''))) {
      e.soDienThoai = 'Số điện thoại không hợp lệ';
    }
    if (!form.email.trim()) {
      e.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Email không hợp lệ';
    }
    if (!form.matKhau) {
      e.matKhau = 'Vui lòng nhập mật khẩu';
    } else if (form.matKhau.length < 6) {
      e.matKhau = 'Mật khẩu tối thiểu 6 ký tự';
    }
    if (!form.xacNhanMatKhau) {
      e.xacNhanMatKhau = 'Vui lòng xác nhận mật khẩu';
    } else if (form.xacNhanMatKhau !== form.matKhau) {
      e.xacNhanMatKhau = 'Mật khẩu xác nhận không khớp';
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await registerUser({
        ho: form.ho.trim(),
        ten: form.ten.trim(),
        soDienThoai: form.soDienThoai.trim(),
        email: form.email.trim(),
        matKhau: form.matKhau,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    window.location.href = getGoogleOAuthUrl();
  };

  const passwordStrength = (() => {
    const p = form.matKhau;
    if (!p) return null;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: 'Yếu', color: 'bg-danger', width: 'w-1/4' };
    if (score <= 2) return { label: 'Trung bình', color: 'bg-accent', width: 'w-2/4' };
    if (score <= 3) return { label: 'Khá', color: 'bg-yellow-400', width: 'w-3/4' };
    return { label: 'Mạnh', color: 'bg-primary-light', width: 'w-full' };
  })();

  // ── Màn hình thành công ─────────────────────────────────
  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-10 animate-fadeInUp">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="font-display font-bold text-2xl text-gray-800 mb-2">
          Đăng ký thành công!
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Chào mừng{' '}
          <span className="font-semibold text-primary">
            {form.ho} {form.ten}
          </span>{' '}
          đến với NongLamFood.
          <br />
          Tài khoản của bạn đã sẵn sàng sử dụng.
        </p>
        <Link
          href="/dang-nhap"
          className="btn-primary inline-flex px-8 py-3 text-sm"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // ── Form đăng ký ────────────────────────────────────────
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-gray-800 tracking-wide uppercase">
          Đăng Ký Tài Khoản
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Bạn đã có tài khoản?{' '}
          <Link
            href="/dang-nhap"
            className="text-primary font-semibold underline underline-offset-2 hover:text-primary-dark transition-colors"
          >
            Đăng nhập tại đây
          </Link>
        </p>
      </div>

      {errors.general && (
        <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm animate-fadeInUp">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-600 tracking-widest uppercase text-center mb-5">
            Thông Tin Cá Nhân
          </h2>

          <div className="space-y-4">
            {/* Họ */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Họ <span className="text-danger">*</span>
              </label>
              <input type="text" value={form.ho} onChange={setField('ho')} placeholder="Họ" className={inputClass(errors.ho)} />
              {errors.ho && <p className="mt-1 text-xs text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.ho}</p>}
            </div>

            {/* Tên */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tên <span className="text-danger">*</span>
              </label>
              <input type="text" value={form.ten} onChange={setField('ten')} placeholder="Tên" className={inputClass(errors.ten)} />
              {errors.ten && <p className="mt-1 text-xs text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.ten}</p>}
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Số điện thoại <span className="text-danger">*</span>
              </label>
              <input type="tel" value={form.soDienThoai} onChange={setField('soDienThoai')} placeholder="0912 345 678" className={inputClass(errors.soDienThoai)} />
              {errors.soDienThoai && <p className="mt-1 text-xs text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.soDienThoai}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email <span className="text-danger">*</span>
              </label>
              <input type="email" value={form.email} onChange={setField('email')} placeholder="email@example.com" className={inputClass(errors.email)} />
              {errors.email && <p className="mt-1 text-xs text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mật khẩu <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.matKhau} onChange={setField('matKhau')} placeholder="Tối thiểu 6 ký tự" className={`${inputClass(errors.matKhau)} pr-11`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Độ mạnh:</span>
                    <span className={`text-xs font-semibold ${passwordStrength.label === 'Mạnh' ? 'text-primary' : passwordStrength.label === 'Khá' ? 'text-yellow-500' : passwordStrength.label === 'Trung bình' ? 'text-accent' : 'text-danger'}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${passwordStrength.color} ${passwordStrength.width}`} />
                  </div>
                </div>
              )}
              {errors.matKhau && <p className="mt-1 text-xs text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.matKhau}</p>}
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Xác nhận mật khẩu <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={form.xacNhanMatKhau} onChange={setField('xacNhanMatKhau')} placeholder="Nhập lại mật khẩu" className={`${inputClass(errors.xacNhanMatKhau)} pr-11`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {form.xacNhanMatKhau && form.matKhau && !errors.xacNhanMatKhau && (
                  <div className="absolute right-9 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
              {errors.xacNhanMatKhau && <p className="mt-1 text-xs text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.xacNhanMatKhau}</p>}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mb-4">
          Bằng cách đăng ký, bạn đồng ý với{' '}
          <Link href="/dieu-khoan" className="text-primary hover:underline font-medium">Điều khoản sử dụng</Link>
          {' '}và{' '}
          <Link href="/chinh-sach-bao-mat" className="text-primary hover:underline font-medium">Chính sách bảo mật</Link>
          {' '}của NongLamFood.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-light hover:bg-primary text-white font-semibold text-base py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" />Đang xử lý...</>) : 'Đăng ký'}
        </button>
      </form>

      {/* Social login */}
      <div className="mt-6">
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs whitespace-nowrap">Hoặc đăng ký bằng</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="flex items-center justify-center gap-2.5 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Google
          </button>

          {/* Facebook - chưa tích hợp */}
          <button disabled className="flex items-center justify-center gap-2.5 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
