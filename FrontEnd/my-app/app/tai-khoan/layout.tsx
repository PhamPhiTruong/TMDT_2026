'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ClipboardList, KeyRound, LogOut } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/dang-nhap');
  };

  const navItems = [
    { name: 'Hồ sơ cá nhân', href: '/tai-khoan/ho-so', icon: User },
    { name: 'Đơn mua', href: '/tai-khoan/don-hang', icon: ClipboardList },
    { name: 'Tạo báo cáo', href: '/tai-khoan/tao-bao-cao', icon: ClipboardList },
    { name: 'Lịch sử báo cáo', href: '/tai-khoan/lich-su-bao-cao', icon: ClipboardList },
    { name: 'Đổi mật khẩu', href: '/tai-khoan/doi-mat-khau', icon: KeyRound },
  ];

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 text-gray-500">Đang tải...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.fullName?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm text-gray-500 font-medium">Tài khoản của</p>
                  <p className="font-bold text-gray-900 truncate">{user.fullName}</p>
                </div>
              </div>

              <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? 'bg-primary/5 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
                <div className="h-px bg-gray-100 my-2 mx-2" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Đăng xuất
                </button>
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 h-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
