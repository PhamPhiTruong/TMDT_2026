import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-primary">
          NongLamFood
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <Link href="/dang-nhap" className="text-gray-600 hover:text-primary transition-colors">
            Đăng nhập
          </Link>
          <Link href="/dang-ky" className="bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary-dark transition-colors">
            Đăng ký
          </Link>
        </nav>
      </div>
    </header>
  );
}
