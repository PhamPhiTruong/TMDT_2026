'use client';

import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, LogOut, LayoutDashboard, KeyRound, AlertOctagon } from 'lucide-react';

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { isAdminLoggedIn, adminUser, adminLogout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAdminLoggedIn && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else if (isAdminLoggedIn && pathname === '/admin/login') {
        router.push('/admin/users');
      }
    }
  }, [isAdminLoggedIn, pathname, router, mounted]);

  if (!mounted) return null;

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAdminLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <Link href="/admin/users" className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-gray-800 tracking-wide uppercase">Admin</h1>
          </Link>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link 
            href="/admin/users" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              pathname === '/admin/users' 
              ? 'bg-primary text-white shadow-md' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Quản lý Users</span>
          </Link>
          <Link 
            href="/admin/reports" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              pathname.startsWith('/admin/reports') 
              ? 'bg-primary text-white shadow-md' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <AlertOctagon className="w-5 h-5" />
            <span className="font-medium">Quản lý Báo Cáo</span>
          </Link>
          <Link 
            href="/admin/doi-mat-khau" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              pathname === '/admin/doi-mat-khau' 
              ? 'bg-primary text-white shadow-md' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <KeyRound className="w-5 h-5" />
            <span className="font-medium">Đổi mật khẩu</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200 text-xs text-gray-400 text-center">
          &copy; 2026 NongLamFood
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-0">
          <div>
            {/* Can put breadcrumb here if needed */}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-sm text-gray-800">{adminUser?.fullName || 'Admin User'}</p>
              <p className="text-xs text-gray-500">{adminUser?.role}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-light/20 flex items-center justify-center text-primary font-bold shadow-sm">
              {adminUser?.fullName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <button
              onClick={() => {
                adminLogout();
                router.push('/admin/login');
              }}
              className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
