'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

interface SpendingData {
  totalSpent: number;
  totalOrders: number;
  monthlySpending: Record<string, number>;
}

export default function SpendingPage() {
  const [data, setData] = useState<SpendingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   const fetchSpendingData = async () => {
      try {
        // 🚀 1. LẤY TOKEN ĐÃ LƯU KHI ĐĂNG NHẬP (Thử lấy từ localStorage)
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

        // 🚀 2. GỬI FETCH KÈM THEO HEADER AUTHORIZATION
        const response = await fetch('http://localhost:8081/api/v1/orders/spending-analytics', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Nếu có token thì gửi kèm, không có thì để trống
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        
        if (response.ok) {
          const resData = await response.json();
          console.log("👉 Dữ liệu thực tế Backend trả về Frontend:", resData);
          setData(resData);
        } else {
          const errorText = await response.text();
          console.error(`❌ Backend báo lỗi hệ thống! Mã trạng thái (Status Code): ${response.status}`);
          console.error(`💬 Nội dung lỗi chi tiết từ Backend:`, errorText);
          
          if (response.status === 403) {
            console.warn("💡 Mẹo: Vẫn bị 403! Hãy kiểm tra xem bạn đã đăng nhập tài khoản trên web chưa, hoặc từ khóa lưu token trong localStorage của bạn tên là gì (token, access_token, jwt...).");
          }
        }
      } catch (error) {
        console.error('❌ Thất bại khi kết nối mạng đến Backend:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpendingData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a5f3a]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Header component */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header tiêu đề của trang chi tiêu */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📊 Thống kê chi tiêu cá nhân</h1>
              <p className="text-sm text-gray-500">Báo cáo tổng ngân sách tích lũy mua sắm</p>
            </div>
            <Link href="/order" className="text-sm font-semibold text-[#1a5f3a] hover:underline">
              Quay lại cửa hàng →
            </Link>
          </div>

          {/* Khối các thẻ số liệu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tổng số tiền đã tiêu</p>
              <p className="text-3xl font-black text-[#1a5f3a] mt-2">
                {(data?.totalSpent || 0).toLocaleString('vi-VN')}đ
              </p>
              <p className="text-xs text-gray-400 mt-2">Áp dụng cho các đơn hàng hoàn tất</p>
            </div>

            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Đơn hàng thành công</p>
              <p className="text-3xl font-black text-gray-800 mt-2">
                {data?.totalOrders || 0} <span className="text-base font-normal text-gray-400">đơn</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">Ghi nhận trên toàn hệ thống hệ thống</p>
            </div>
          </div>

          {/* Bảng chi tiết theo từng Tháng */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              📅 Nhật ký chi tiêu theo tháng
            </h2>
            
            {!data || Object.keys(data.monthlySpending).length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-sm text-gray-400">Hệ thống chưa tìm thấy dữ liệu đơn hàng "COMPLETED" nào.</p>
                <p className="text-xs text-amber-600 mt-1">💡 Hãy vào Navicat bảng 'orders' chỉnh cột status thành COMPLETED và user_id thành 1 nhé!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(data.monthlySpending).map(([month, amount]) => (
                  <div key={month} className="flex items-center justify-between p-4 bg-gray-50/70 hover:bg-gray-50 rounded-xl transition border border-gray-100">
                    <div>
                      <div className="text-sm font-bold text-gray-800">Tháng {month}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Danh mục: Đồ khô sấy</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-sm text-gray-900">-{amount.toLocaleString('vi-VN')}đ</div>
                      <div className="text-[10px] px-2 py-0.5 bg-emerald-50 text-[#1a5f3a] rounded-full font-bold mt-1 inline-block border border-emerald-200">
                        Thành công
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* 2. Footer component */}
      <Footer />

      {/* 3. Floating utility buttons (Nút bấm nổi) */}
      <FloatingButtons />
    </div>
  );
}