'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { loginWithGoogle } from '@/lib/authService';
import { useAuth } from '@/app/context/AuthContext';

export default function OAuth2RedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const code  = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
      setErrorMessage('Đăng nhập Google bị huỷ hoặc xảy ra lỗi. Vui lòng thử lại.');
      return;
    }

    // Gửi authorization code lên backend để đổi JWT
    loginWithGoogle(code)
      .then((data) => {
        login(data);
        router.replace('/');
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Đăng nhập Google thất bại.';
        setErrorMessage(message);
      });
  }, [searchParams, login, router]);

  if (errorMessage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-6 py-4 text-sm max-w-md text-center">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
        <button
          onClick={() => router.replace('/dang-nhap')}
          className="text-primary font-semibold hover:underline text-sm"
        >
          ← Quay lại trang đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-gray-600 font-medium">Đang xác thực tài khoản Google...</p>
    </div>
  );
}
