'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Send, ShieldCheck, Mail, MapPin, PhoneCall } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  const paymentIcons = [
    { name: 'ACB', src: '/icons/acb.png' },
    { name: 'BIDV', src: '/icons/bidv.jpg' },
    { name: 'MB', src: '/icons/mb.jpg' },
    { name: 'Techcombank', src: '/icons/techcombank.jpg' },
    { name: 'Momo', src: '/icons/momo.webp' },
    { name: 'Vietcombank', src: '/icons/vietcombank.webp' },
    { name: 'VNPAY', src: '/icons/vnpay.jpg' },
    { name: 'ZaloPay', src: '/icons/zalopay.webp' },
  ];

  return (
    <footer className="w-full bg-[#1b2b1d] text-gray-300 mt-auto border-t border-gray-800">
      {/* 1. Newsletter & Social Section */}
      <div className="bg-[#131e15] border-b border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-white text-base font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary-light" />
              Đăng ký nhận khuyến mãi đặc biệt
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              Nhận ngay mã giảm giá 10% khi đăng ký thành viên mới hôm nay!
            </p>
          </div>

          <div className="w-full max-w-md">
            <form onSubmit={handleSubscribe} className="flex gap-2 relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập địa chỉ email của bạn..."
                className="w-full bg-[#1b2b1d] border border-gray-700 text-white rounded-xl py-2.5 px-4 text-sm focus:border-primary-light outline-none"
              />
              <button
                type="submit"
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-200 ${
                  subscribed
                    ? 'bg-green-600 text-white'
                    : 'bg-primary hover:bg-primary-light text-white'
                }`}
              >
                {subscribed ? 'Đã đăng ký' : 'Đăng ký'}
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Col 1: Contact / Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-white font-black text-sm">
              NL
            </div>
            <span className="text-white text-lg font-bold tracking-tight">NongLamStore</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Nền tảng cung cấp nông sản sạch và các sản phẩm trái cây sấy dẻo, sấy giòn tự nhiên cao cấp phục vụ sức khỏe cộng đồng.
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary-light shrink-0 mt-0.5" />
              <span>311-G9 Đường số 8, Phường An Phú, TP. Thủ Đức, TP. Hồ Chí Minh</span>
            </div>
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-primary-light shrink-0" />
              <span>0901.958.070</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-primary-light shrink-0" />
              <span>nonglamfood@support.com</span>
            </div>
          </div>
        </div>

        {/* Col 2: Info */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Thông tin</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/" className="hover:text-primary-light transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/san-pham" className="hover:text-primary-light transition-colors">
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link href="/tin-tuc" className="hover:text-primary-light transition-colors">
                Tin tức | Mẹo vặt
              </Link>
            </li>
            <li>
              <Link href="/gioi-thieu" className="hover:text-primary-light transition-colors">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link href="/hop-tac" className="hover:text-primary-light transition-colors">
                Hợp tác kinh doanh
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary-light transition-colors">
                Kiểm tra đơn hàng
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Support */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Hỗ trợ khách hàng</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/tim-kiem" className="hover:text-primary-light transition-colors">
                Tìm kiếm sản phẩm
              </Link>
            </li>
            <li>
              <Link href="/chinh-sach-doi-tra" className="hover:text-primary-light transition-colors">
                Chính sách đổi trả
              </Link>
            </li>
            <li>
              <Link href="/chinh-sach-bao-mat" className="hover:text-primary-light transition-colors">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link href="/chinh-sach-van-chuyen" className="hover:text-primary-light transition-colors">
                Chính sách vận chuyển
              </Link>
            </li>
            <li>
              <Link href="/dieu-khoan" className="hover:text-primary-light transition-colors">
                Điều khoản & Quy định chung
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Payments & Socials */}
        <div className="space-y-6">
          <div>
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Tổng đài hỗ trợ</h4>
            <p className="text-xs text-gray-400">Hotline phản hồi khách hàng:</p>
            <p className="text-lg font-black text-red-500 mt-1">0901.958.070</p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs mb-3 uppercase tracking-wider">Phương thức thanh toán</h4>
            <div className="grid grid-cols-4 gap-2">
              {paymentIcons.map((payment) => (
                <div
                  key={payment.name}
                  className="bg-white rounded-lg p-1 aspect-video flex items-center justify-center relative overflow-hidden group shadow-sm border border-gray-800"
                  title={payment.name}
                >
                  <Image
                    src={payment.src}
                    alt={payment.name}
                    width={50}
                    height={20}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom bar */}
      <div className="bg-[#131e15] text-gray-500 text-xs py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="https://facebook.com" className="text-gray-400 hover:text-[#1877f2] transition-colors" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </Link>
            <Link href="https://instagram.com" className="text-gray-400 hover:text-[#c13584] transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </Link>
            <Link href="https://youtube.com" className="text-gray-400 hover:text-[#ff0000] transition-colors" aria-label="Youtube">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </Link>
          </div>
          
          <div className="text-center sm:text-right space-y-1">
            <p>© 2026 NongLamStore. Tất cả các quyền được bảo lưu.</p>
            <p className="text-[10px] text-gray-600 flex items-center justify-center sm:justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-light" />
              Sản phẩm đạt chuẩn nông sản sạch chất lượng cao của VietGAP.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
