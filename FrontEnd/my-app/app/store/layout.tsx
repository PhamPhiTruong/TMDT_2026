'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/store/dashboard/Sidebar';
import AdminHeader from '@/components/store/dashboard/AdminHeader';
import { useAuth } from '@/app/context/AuthContext';

/**
 * Layout cho khu vực Quản lý cửa hàng (/store/**).
 * Chỉ tài khoản có role STORE_OWNER mới được truy cập.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/dang-nhap');
      return;
    }
    if (user?.role !== 'STORE_OWNER') {
      router.replace('/');
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || user?.role !== 'STORE_OWNER') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="md:ml-64 flex min-h-screen flex-col">
        <AdminHeader />

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
