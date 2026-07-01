'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../app/context/CartContext';
import { useAuth } from '../app/context/AuthContext';
import { ShoppingCart, User, MessageSquare, ClipboardList, BarChart3, Search, Menu, X, Phone } from 'lucide-react';
export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    if (searchParams) {
      setSearchKeyword(searchParams.get('q') || '');
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      router.push(`/san-pham?q=${encodeURIComponent(searchKeyword.trim())}`);
      setMobileMenuOpen(false);
    } else {
      router.push(`/san-pham`);
      setMobileMenuOpen(false);
    }
  };

  // Tránh lỗi hydration mismatch bằng cách chỉ render số lượng giỏ hàng sau khi component mount ở Client
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Tính toán số lượng sản phẩm dựa trên dữ liệu thực tế từ CartContext
  const totalItems = mounted && cartItems
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      {/* 1. Announcement Bar (Top Bar) */}
      <div className="bg-primary-dark text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium">
              <Phone className="w-3.5 h-3.5" />
              Hotline: 0901.958.070
            </span>
            <span className="hidden sm:inline-block text-gray-200">|</span>
            <span className="hidden sm:inline-block font-medium text-gray-200">
              Giao hàng nhanh toàn quốc - Đảm bảo vệ sinh an toàn thực phẩm
            </span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <Link href="/#khuyen-mai" className="hover:text-primary-light transition-colors">
              Khuyến mãi
            </Link>
            <span>|</span>
            <Link href="/he-thong-cua-hang" className="hover:text-primary-light transition-colors">
              Hệ thống cửa hàng
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-dark to-primary flex items-center justify-center text-white font-extrabold text-xl shadow-md">
            NL
          </div>
          <span className="text-xl md:text-2xl font-extrabold text-primary tracking-tight">
            NongLamFood
          </span>
        </Link>

        {/* Search Bar */}
        <form className="hidden md:flex flex-1 max-w-lg relative" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm kiếm nông sản, trái cây sấy..."
            className="w-full bg-gray-50 border border-gray-200 focus:border-primary rounded-xl py-2.5 pl-4 pr-10 text-sm outline-none transition-all focus:bg-white"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
            aria-label="Tìm kiếm"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Action icons / Quick links */}
        <div className="flex items-center gap-2 md:gap-5">
          {/* 📊 NÚT CHI TIÊU (Giao diện Máy tính) */}
          <Link
            href="/spending"
            className="flex flex-col items-center text-gray-600 hover:text-primary transition-all group"
          >
            <BarChart3 className="w-5 h-5 group-hover:scale-105 transition-transform" />
            <span className="text-[10px] font-bold mt-1 hidden sm:inline-block">Chi tiêu</span>
          </Link>

          {/* 📋 NÚT ĐƠN HÀNG (Giao diện Máy tính) */}
          <Link
            href="/order"
            className="flex flex-col items-center text-gray-600 hover:text-primary transition-all group"
          >
            <ClipboardList className="w-5 h-5 group-hover:scale-105 transition-transform" />
            <span className="text-[10px] font-bold mt-1 hidden sm:inline-block">Đơn hàng</span>
          </Link>

          {/* Messages */}
          <Link
            href="/tin-nhan"
            className="flex flex-col items-center text-gray-600 hover:text-primary transition-all group"
          >
            <MessageSquare className="w-5 h-5 group-hover:scale-105 transition-transform" />
            <span className="text-[10px] font-bold mt-1 hidden sm:inline-block">Tin nhắn</span>
          </Link>

          {/* User Account */}
          {mounted && isLoggedIn && user ? (
            <div className="relative group/account">
              <Link
                href="/tai-khoan/ho-so"
                className="flex flex-col items-center text-gray-600 hover:text-primary transition-all group"
              >
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] overflow-hidden border border-primary/20 group-hover:scale-105 transition-transform">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    user.fullName?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <span className="text-[10px] font-bold mt-1 hidden sm:inline-block truncate max-w-[60px]" title={user.fullName}>
                  {user.fullName.split(' ').pop()}
                </span>
              </Link>
              {/* Dropdown on hover */}
              <div className="absolute right-0 top-full pt-1 w-48 opacity-0 invisible group-hover/account:opacity-100 group-hover/account:visible transition-all z-50">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 space-y-1">
                  <Link href="/tai-khoan/ho-so" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors">
                    Hồ sơ của tôi
                  </Link>
                  <Link href="/tai-khoan/don-hang" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors">
                    Đơn mua
                  </Link>
                  <button onClick={() => logout()} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/dang-nhap"
              className="flex flex-col items-center text-gray-600 hover:text-primary transition-all group"
            >
              <User className="w-5 h-5 group-hover:scale-105 transition-transform" />
              <span className="text-[10px] font-bold mt-1 hidden sm:inline-block">Đăng nhập</span>
            </Link>
          )}

          {/* 🛒 Giỏ hàng thực tế */}
          <Link
            href="/cart"
            className="flex flex-col items-center text-gray-600 hover:text-primary transition-all relative group"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-1 hidden sm:inline-block">Giỏ hàng</span>
          </Link>

          {/* Mobile Hamburger Menu Toggler */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. Secondary Nav Bar (Seasonal Categories) */}
      <div className="bg-primary text-white text-xs md:text-sm font-bold shadow-inner hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-8 py-3">
            <Link
              href="/"
              className="hover:text-primary-light transition-all border-b-2 border-transparent hover:border-white pb-0.5 tracking-wider uppercase"
            >
              Trái cây sấy mùa xuân
            </Link>
            <Link
              href="/"
              className="hover:text-primary-light transition-all border-b-2 border-transparent hover:border-white pb-0.5 tracking-wider uppercase"
            >
              Trái cây sấy mùa hè
            </Link>
            <Link
              href="/"
              className="hover:text-primary-light transition-all border-b-2 border-transparent hover:border-white pb-0.5 tracking-wider uppercase"
            >
              Trái cây sấy mùa thu
            </Link>
            <Link
              href="/"
              className="hover:text-primary-light transition-all border-b-2 border-transparent hover:border-white pb-0.5 tracking-wider uppercase"
            >
              Trái cây sấy mùa đông
            </Link>
            <Link
              href="/lien-he"
              className="hover:text-primary-light transition-all border-b-2 border-transparent hover:border-white pb-0.5 tracking-wider uppercase ml-auto"
            >
              Liên hệ
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white p-4 space-y-4 animate-fadeInUp shadow-inner">
          <form className="relative" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-sm outline-none"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <nav className="flex flex-col gap-3 font-semibold text-gray-700">
            {/* 📊 NÚT CHI TIÊU (Giao diện Điện thoại) */}
            <Link
              href="/spending"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-primary py-1 border-b border-gray-50 flex items-center gap-2 text-primary font-bold"
            >
              <BarChart3 className="w-4 h-4" /> Thống kê chi tiêu
            </Link>

            {/* 📋 NÚT ĐƠN HÀNG (Giao diện Điện thoại) */}
            <Link
              href="/order"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-primary py-1 border-b border-gray-50 flex items-center gap-2 text-gray-600"
            >
              <ClipboardList className="w-4 h-4" /> Đơn hàng
            </Link>
            
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-primary py-1 border-b border-gray-50"
            >
              Trái cây sấy mùa xuân
            </Link>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-primary py-1 border-b border-gray-50"
            >
              Trái cây sấy mùa hè
            </Link>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-primary py-1 border-b border-gray-50"
            >
              Trái cây sấy mùa thu
            </Link>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-primary py-1 border-b border-gray-50"
            >
              Trái cây sấy mùa đông
            </Link>
            <Link
              href="/lien-he"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-primary py-1"
            >
              Liên hệ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}