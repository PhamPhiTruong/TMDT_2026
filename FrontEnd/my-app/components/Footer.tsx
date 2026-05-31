import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <p className="mb-2 font-semibold text-gray-700">NongLamFood</p>
        <p>Cửa hàng nông sản sấy chất lượng cao</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <Link href="/dieu-khoan" className="hover:text-primary transition-colors">
            Điều khoản sử dụng
          </Link>
          <Link href="/chinh-sach-bao-mat" className="hover:text-primary transition-colors">
            Chính sách bảo mật
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">© 2026 NongLamFood. All rights reserved.</p>
      </div>
    </footer>
  );
}
