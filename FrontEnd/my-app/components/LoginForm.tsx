'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { loginUser, getGoogleOAuthUrl } from '@/lib/authService';
import { useAuth } from '@/app/context/AuthContext';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

    setIsLoading(true);
    setErrors({});

    try {
      // 1. Gọi API đăng nhập từ authService
      const rawData = await loginUser({ email, password });
      
      // Ép kiểu sang 'any' để TypeScript không gạch chân báo lỗi thuộc tính lạ
      const data = rawData as any;
      
      // 2. Trích xuất token linh hoạt dựa trên cấu trúc Response thực tế của Backend
      const token = data?.token || data?.accessToken || data?.result?.token || data?.result?.accessToken;
      
      if (token) {
        // Chủ động lưu token vào localStorage ngay lập tức
        localStorage.setItem('token', token);
      } else {
        console.warn("Cảnh báo: Không tìm thấy token trong phản hồi từ API đăng nhập!", data);
      }

      // 3. Cập nhật trạng thái Context toàn cục
      await login(data);          
      
      // 4. Chuyển hướng về trang chủ và làm mới trạng thái
      router.push('/');     
      router.refresh(); 
   } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Email hoặc mật khẩu không đúng.';
      
      if (message.includes("Uncategorized") || message.includes("chưa được kích hoạt")) {
        router.push(`/xac-thuc-otp?email=${encodeURIComponent(email)}`);
        return;
      }

      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    window.location.href = getGoogleOAuthUrl();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-gray-800 tracking-wide uppercase">
          Đăng Nhập Tài Khoản
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Bạn chưa có tài khoản?{' '}
          <Link
            href="/dang-ky"
            className="text-primary font-semibold underline underline-offset-2 hover:text-primary-dark transition-colors"
          >
            Đăng ký tại đây
          </Link>
        </p>
      </div>

      {/* General error */}
      {errors.general && (
        <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm animate-fadeInUp">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="Email"
            className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all
              placeholder:text-gray-400
              ${
                errors.email
                  ? 'border-danger bg-red-50 focus:border-danger focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-green-100'
              }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-danger flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Mật khẩu <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="Mật khẩu"
              className={`w-full border rounded-lg px-4 py-3 pr-11 text-sm outline-none transition-all
                placeholder:text-gray-400
                ${
                  errors.password
                    ? 'border-danger bg-red-50 focus:border-danger focus:ring-2 focus:ring-red-100'
                    : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-green-100'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-danger flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.password}
            </p>
          )}
          <p className="mt-1.5 text-xs text-gray-500">
            Quên mật khẩu? Nhấn vào{' '}
            <Link
              href="/quen-mat-khau"
              className="text-primary font-medium hover:underline"
            >
              đây
            </Link>
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-light hover:bg-primary text-white font-semibold text-base py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>

      {/* Social login divider */}
      <div className="mt-6">
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs whitespace-nowrap">
            Hoặc đăng nhập bằng
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Google - kết nối thật */}
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="flex items-center justify-center gap-2.5 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
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
          <button
            disabled
            className="flex items-center justify-center gap-2.5 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60"
          >
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