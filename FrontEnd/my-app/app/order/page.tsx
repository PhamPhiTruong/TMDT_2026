'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

// 🌟 Import Header và Footer từ thư mục components của bạn
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 🌟 Định nghĩa kiểu dữ liệu đồng bộ Backend
export interface OrderRequest {
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: string;
}

// 🌟 1. Kho dữ liệu hành chính mở rộng nội bộ (Đặt ngoài Component để tránh re-render)
const VIETNAM_REGIONS = [
  {
    province: "TP. Hồ Chí Minh",
    districts: ["Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 7", "Quận 10", "Quận Bình Thạnh", "Quận Phú Nhuận", "Quận Tân Bình", "TP. Thủ Đức", "Huyện Nhà Bè", "Huyện Bình Chánh"]
  },
  {
    province: "Hà Nội",
    districts: ["Quận Hoàn Kiếm", "Quận Ba Đình", "Quận Đống Đa", "Quận Cầu Giấy", "Quận Hai Bà Trưng", "Quận Tây Hồ", "Quận Thanh Xuân", "Quận Long Biên", "Quận Hà Đông", "Huyện Nam Từ Liêm"]
  },
  {
    province: "Đà Nẵng",
    districts: ["Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà", "Quận Ngũ Hành Sơn", "Quận Liên Chiểu", "Quận Cẩm Lệ", "Huyện Hòa Vang"]
  },
  {
    province: "Bình Dương",
    districts: ["TP. Thủ Dầu Một", "TP. Thuận An", "TP. Dĩ An", "TP. Tân Uyên", "TP. Bến Cát", "Huyện Bắc Tân Uyên"]
  },
  {
    province: "Đồng Nai",
    districts: ["TP. Biên Hòa", "TP. Long Khánh", "Huyện Nhơn Trạch", "Huyện Long Thành", "Huyện Trảng Bom"]
  },
  {
    province: "Cần Thơ",
    districts: ["Quận Ninh Kiều", "Quận Cái Răng", "Quận Bình Thủy", "Quận Ô Môn", "Quận Thốt Nốt"]
  },
  {
    province: "Hải Phòng",
    districts: ["Quận Hồng Bàng", "Quận Ngô Quyền", "Quận Lê Chân", "Quận Hải An", "Quận Kiến An"]
  },
  {
    province: "Lâm Đồng",
    districts: ["TP. Đà Lạt", "TP. Bảo Lộc", "Huyện Đức Trọng", "Huyện Đơn Dương", "Huyện Di Linh"]
  }
];

// 🌟 2. Danh sách địa chỉ đã lưu mẫu để tăng trải nghiệm người dùng
const SAVED_ADDRESSES = [
  { id: 1, label: "Nhà riêng", fullName: "Nguyễn Văn A", phone: "0901234567", province: "TP. Hồ Chí Minh", district: "Quận 7", ward: "Phường Tân Phong", address: "45/12 Đường số 8" },
  { id: 2, label: "Văn phòng", fullName: "Nguyễn Văn A - Công ty", phone: "0987654321", province: "Hà Nội", district: "Quận Cầu Giấy", ward: "Phường Dịch Vọng", address: "Tòa nhà ABC, Duy Tân" },
];

export default function OrderPage() {
  const router = useRouter();
  const { 
    cartItems, 
    setCartItems, 
    subtotal,
    appliedDiscount, 
    finalTotal: contextFinalTotal,
  } = useCart();

  const [shippingMethod, setShippingMethod] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Form thu thập dữ liệu giao hàng linh hoạt
  const [formData, setFormData] = useState({
    fullName: '', 
    phone: '', 
    address: '',
    province: '', // Để trống mặc định để bắt buộc người dùng chọn
    district: '', 
    ward: '', 
    note: ''
  });

  const shippingFee = shippingMethod === 0 ? 30000 : 25000;
  const finalTotal = contextFinalTotal + shippingFee;

  // Chỉ lấy những mặt hàng đã được tích chọn từ Giỏ hàng trước đó
  const checkedItems = cartItems.filter(item => item.checked);

  // Hàm xử lý điền nhanh địa chỉ đã lưu
  const handleSelectSavedAddress = (addr: typeof SAVED_ADDRESSES[0]) => {
    setFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      province: addr.province,
      district: addr.district,
      ward: addr.ward,
      address: addr.address,
      note: formData.note
    });
  };

  // Tự động tìm mảng Quận/Huyện tương ứng với Tỉnh/Thành đang chọn
  const availableDistricts = VIETNAM_REGIONS.find(r => r.province === formData.province)?.districts || [];

  // 🌟 Hàm xử lý gửi yêu cầu tạo Order đơn thuần
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address || !formData.province || !formData.district || !formData.ward) {
      alert('Vui lòng điền đầy đủ các thông tin nhận hàng bắt buộc!');
      return;
    }

    if (checkedItems.length === 0) {
      alert('Không tìm thấy sản phẩm hợp lệ nào để tạo đơn hàng. Vui lòng quay lại giỏ hàng!');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token'); 
      const fullAddress = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`;

      const response = await fetch('http://localhost:8081/api/v1/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          address: fullAddress,
          note: formData.note,
          paymentMethod: "PENDING_CHOOSE" // Chuyển giao phương thức quyết định sang trang Payment kế tiếp
        })
      });

      if (response.ok) {
        const newOrder = await response.json(); 
        
        // Tạo đơn thành công -> Giải phóng các món này ra khỏi danh sách hiển thị cục bộ
        setCartItems(prev => prev.filter(item => !item.checked));
        
        // Đơn hàng của bạn kết thúc tại đây, chuyển giao "orderId" và số tiền cho bạn làm Payment
        router.push(`/payment?orderId=${newOrder.orderId}&amount=${finalTotal}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`❌ Lập đơn hàng thất bại: ${errorData.message || 'Vui lòng kiểm tra lại tồn kho hệ thống!'}`);
      }
    } catch (error) {
      console.error('Lỗi hệ thống kết nối đặt hàng:', error);
      alert('❌ Không thể kết nối tới máy chủ Backend!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 🌟 1. HIỂN THỊ HEADER Ở TRÊN CÙNG */}
      <Header />

      {/* 2. NỘI DUNG CHÍNH CỦA TRANG ĐẶT HÀNG */}
      <div className="min-h-screen bg-[#f4f6f8] py-10 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Thanh Điều Hướng Trên Cùng */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
            <Link href="/cart" className="text-sm font-medium text-gray-600 hover:text-[#1a5f3a] flex items-center gap-1 transition">
              ← Sửa lại giỏ hàng
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a5f3a] rounded-xl flex items-center justify-center text-white font-bold text-xl">NL</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nông Lâm Store</h1>
                <p className="text-xs text-gray-500">Xác nhận thông tin đơn hàng</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-semibold">
              Bước 1: Lập đơn hàng & Giữ kho
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* CỘT TRÁI: NHẬP LIỆU THÔNG TIN GIAO HÀNG */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="p-1.5 bg-green-50 text-[#1a5f3a] rounded-lg text-sm">📍</span> Thông tin địa chỉ nhận hàng
                </h2>

                {/* Khối tính năng chọn nhanh địa chỉ đã lưu */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-500 mb-2">Chọn nhanh địa chỉ đã lưu:</label>
                  <div className="flex flex-wrap gap-2">
                    {SAVED_ADDRESSES.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(addr)}
                        className="px-3 py-1.5 text-xs font-medium border border-gray-200 hover:border-[#1a5f3a] hover:bg-emerald-50 rounded-xl transition text-gray-700 flex items-center gap-1"
                      >
                        🏠 {addr.label}: {addr.address}, {addr.district}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-100 my-4" />
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Họ và tên người nhận <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a5f3a]" placeholder="Nhập tên người mua" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Số điện thoại liên hệ <span className="text-red-500">*</span></label>
                      <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a5f3a]" placeholder="Số điện thoại shipper gọi" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Số nhà, tên đường cụ thể <span className="text-red-500">*</span></label>
                    <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a5f3a]" placeholder="Ví dụ: 45/12 Đường số 8" />
                  </div>

                  {/* 🌟 ĐỒNG BỘ CHỌN ĐA DẠNG TỈNH THÀNH / QUẬN HUYỆN */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
                      <select 
                        required
                        value={formData.province} 
                        onChange={(e) => setFormData({...formData, province: e.target.value, district: ''})} // Reset quận khi đổi tỉnh
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#1a5f3a]"
                      >
                        <option value="">Chọn Tỉnh/Thành</option>
                        {VIETNAM_REGIONS.map((item) => (
                          <option key={item.province} value={item.province}>{item.province}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Quận/Huyện <span className="text-red-500">*</span></label>
                      <select 
                        required
                        value={formData.district} 
                        onChange={(e) => setFormData({...formData, district: e.target.value})} 
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#1a5f3a] disabled:bg-gray-50 disabled:text-gray-400"
                        disabled={!formData.province} // Khóa lại nếu chưa chọn Tỉnh
                      >
                        <option value="">Chọn Quận/Huyện</option>
                        {availableDistricts.map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Phường/Xã <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.ward} onChange={(e) => setFormData({...formData, ward: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a5f3a]" placeholder="Phường Tân Phong" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Lời nhắn kèm theo (Ghi chú)</label>
                    <textarea value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a5f3a] h-20 resize-none" placeholder="Lưu ý giao giờ hành chính, gọi trước khi giao..." />
                  </div>
                </div>
              </div>

              {/* DANH SÁCH SẢN PHẨM Ở DẠNG XEM TRƯỚC GỌN GÀNG */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-gray-800 mb-4">📦 Danh sách sản phẩm mua chốt đơn ({checkedItems.length})</h2>
                <div className="divide-y divide-gray-100 max-h-[280px] overflow-y-auto pr-2">
                  {checkedItems.map(item => (
                    <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0 items-center">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border bg-gray-50 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 truncate">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Số lượng: <span className="font-semibold text-gray-700">{item.quantity}</span></div>
                      </div>
                      <div className="font-semibold text-sm text-gray-900">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: PHƯƠNG THỨC VẬN CHUYỂN & CHỐT ĐƠN */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-6 space-y-6">
                
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">🚚 Hình thức vận chuyển</h3>
                  <div className="space-y-2">
                    <div onClick={() => setShippingMethod(0)} className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${shippingMethod === 0 ? 'border-[#1a5f3a] bg-emerald-50/40 text-[#1a5f3a]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-2.5">
                        <input type="radio" checked={shippingMethod === 0} readOnly className="accent-[#1a5f3a]" />
                        <div className="text-sm font-medium">Giao hàng nhanh (1-2 ngày)</div>
                      </div>
                      <span className="text-sm font-bold">30.000đ</span>
                    </div>

                    <div onClick={() => setShippingMethod(1)} className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${shippingMethod === 1 ? 'border-[#1a5f3a] bg-emerald-50/40 text-[#1a5f3a]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-2.5">
                        <input type="radio" checked={shippingMethod === 1} readOnly className="accent-[#1a5f3a]" />
                        <div className="text-sm font-medium">Giao tiêu chuẩn (3-5 ngày)</div>
                      </div>
                      <span className="text-sm font-bold">25.000đ</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm text-gray-600">
                  <div className="flex justify-between"><span>Tiền hàng thực tế</span><span className="font-medium text-gray-900">{subtotal.toLocaleString('vi-VN')}đ</span></div>
                  <div className="flex justify-between"><span>Phí ship tạm tính</span><span className="font-medium text-gray-900">{shippingFee.toLocaleString('vi-VN')}đ</span></div>
                  
                  {/* Hiển thị Voucher đã được căn lề trong khối thanh toán */}
                  {appliedDiscount && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Giảm giá Voucher ({appliedDiscount.code})</span>
                      <span>- {appliedDiscount.amount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-base font-bold text-gray-900 border-t border-dashed pt-3 mt-1">
                    <span>Giá trị đơn hàng</span>
                    <span className="text-lg text-[#1a5f3a]">
                      {finalTotal.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-[#1a5f3a] hover:bg-[#13482a] text-white py-3.5 rounded-xl text-base font-bold transition-all shadow-sm shadow-emerald-900/10 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {isLoading ? 'Hệ thống đang lập đơn...' : 'XÁC NHẬN ĐẶT HÀNG'}
                </button>
                
                <p className="text-[11px] text-center text-gray-400">
                  Bằng việc nhấn xác nhận, hệ thống sẽ tiến hành trừ số lượng kho và lập hóa đơn tạm thời. Bạn sẽ chọn phương thức thanh toán ví/bank ở bước tiếp theo.
                </p>
              </div>
            </div>

          </form>
        </div>
      </div>

      {/* 🌟 3. HIỂN THỊ FOOTER Ở DƯỚI CÙNG */}
      <Footer />
    </>
  );
}