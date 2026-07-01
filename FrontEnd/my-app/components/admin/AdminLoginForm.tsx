'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { loginAdmin } from '@/lib/adminAuthService';
import { useAdminAuth } from '@/app/admin/context/AdminAuthContext';

export default function AdminLoginForm() {
  const router = useRouter();
  const { adminLogin } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
    }
    return newErrors;
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
      const data = await loginAdmin({ email, password });
      adminLogin(data); // Lưu vào AdminAuthContext + localStorage (admin keys)
      router.push('/admin/users');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Đăng nhập quản trị thất bại.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-blue-500" />
      
      {/* Title */}
      <div className="text-center mb-8 mt-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 text-primary">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="font-display font-bold text-2xl text-gray-800 tracking-wide uppercase">
          Admin Portal
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Hệ thống quản trị nội bộ
        </p>
      </div>

      {/* General error */}
      {errors.general && (
        <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm animate-fadeInUp">
          <AlertCircle className="w-5 h-5 mt-0 flex-shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email Admin
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="admin@example.com"
            className={`w-full border rounded-xl px-4 py-3.5 text-sm text-gray-900 font-medium outline-none transition-all
              placeholder:text-gray-500 bg-gray-50
              ${
                errors.email
                  ? 'border-danger bg-red-50 focus:border-danger focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
              }`}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-danger flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="••••••••"
              className={`w-full border rounded-xl px-4 py-3.5 pr-11 text-sm text-gray-900 font-medium outline-none transition-all
                placeholder:text-gray-500 bg-gray-50
                ${
                  errors.password
                    ? 'border-danger bg-red-50 focus:border-danger focus:ring-2 focus:ring-red-100'
                    : 'border-gray-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-danger flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 hover:bg-black text-white font-semibold text-base py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg shadow-gray-900/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang xác thực...
            </>
          ) : (
            'Đăng Nhập Quản Trị'
          )}
        </button>
      </form>
    </div>
  );
}
