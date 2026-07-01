'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get('orderId') || '';
  const amountStr = searchParams.get('amount') || '0';
  const amount = parseInt(amountStr, 10);

  const [paymentMethod, setPaymentMethod] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Các State phục vụ luồng OTP và hiển thị thông báo
  const [isOtpStep, setIsOtpStep] = useState<boolean>(false); 
  const [otpCode, setOtpCode] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!orderId) {
      alert('⚠️ Không tìm thấy thông tin đơn hàng hợp lệ!');
      router.push('/cart');
    }
  }, [orderId, router]);

  // 🌟 HÀM 1: Gửi yêu cầu thanh toán (Xử lý OTP Mail hoặc Sinh link MoMo)
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    let methodString = "BANK_TRANSFER";
    if (paymentMethod === 1) methodString = "MOMO";
    if (paymentMethod === 2) methodString = "COD";

    try {
      const token = localStorage.getItem('accessToken');
      
      // 🚨 ĐOẠN CHECK BẢO HIỂM: Kiểm tra cấu trúc token JWT (phải có đủ 3 phần phân tách bằng dấu chấm)
      if (!token || token === "undefined" || token.split('.').length !== 3) {
        setMessage("❌ Thất bại: Phiên đăng nhập đã hết hạn hoặc Token JWT không hợp lệ. Vui lòng đăng xuất và đăng nhập lại tài khoản!");
        setIsLoading(false);
        return;
      }
      
      // Gọi lên API xử lý yêu cầu thanh toán
      const response = await fetch(`http://localhost:8080/api/v1/orders/${orderId}/payment-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentMethod: methodString })
      });

      const data = await response.json();

      if (response.ok) {
        // 🌟 NHÁNH 1: KIỂM TRA NẾU LÀ MOMO -> Chuyển hướng sang cổng MoMo Sandbox
        if (data.status === "REDIRECT") {
          if (data.payUrl) {
            setMessage("🔄 Đang kết nối bảo mật và chuyển hướng sang cổng MoMo...");
            setTimeout(() => {
              window.location.href = data.payUrl; 
            }, 1000);
          } else {
            setMessage("❌ Thất bại: Hệ thống MoMo không trả về đường dẫn liên kết payUrl!");
            setIsLoading(false);
          }
          return;
        }

        // 🌟 NHÁNH 2: DÀNH CHO COD / BANK TRANSFER -> Bật giao diện nhập OTP từ Email
        if (data.status === "PENDING_OTP") {
          setMessage(`📩 ${data.message}`);
          setIsOtpStep(true); 
        }
      } else {
        setMessage(`❌ Thất bại: ${data.message || 'Không thể xử lý yêu cầu thanh toán!'}`);
      }
    } catch (error) {
      setMessage('❌ Không thể kết nối tới máy chủ Backend!');
    } finally {
      setIsLoading(false);
    }
  };

  // 🌟 HÀM 2: Gửi mã OTP người dùng nhập lên để chốt đơn hoàn tất
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token || token === "undefined") {
        setMessage("❌ Thất bại: Không tìm thấy Token xác thực. Vui lòng đăng nhập lại!");
        setIsLoading(false);
        return;
      }

      // Gọi API đối soát OTP thanh toán
      const response = await fetch(`http://localhost:8080/api/v1/orders/${orderId}/payment-verify?otpCode=${otpCode}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert("🎉 Thanh toán thành công!");
        router.push(`/`); 
      } else {
        setMessage(`❌ ${data.message || 'Mã OTP không đúng!'}`);
      }
    } catch (error) {
      setMessage('❌ Không thể kết nối tới máy chủ!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#f4f6f8] py-10 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Tiến trình các bước */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1a5f3a] text-white flex items-center justify-center text-xs font-bold">✓</span>
              <span className="text-sm font-medium text-gray-500">Lập đơn hàng</span>
            </div>
            <div className="w-20 h-[2px] bg-[#1a5f3a]"></div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1a5f3a] text-white flex items-center justify-center text-xs font-bold">2</span>
              <span className="text-sm font-bold text-gray-900">Thanh toán & Xác thực</span>
            </div>
            <div className="w-20 h-[2px] bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold">3</span>
              <span className="text-sm font-medium text-gray-400">Hoàn tất</span>
            </div>
          </div>

          {/* Banner trạng thái hệ thống */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium text-center shadow-sm ${message.includes('❌') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* CỘT TRÁI: CHỌN PHƯƠNG THỨC THANH TOÁN */}
            <div className="md:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="p-1.5 bg-green-50 text-[#1a5f3a] rounded-lg text-sm">💳</span> Chọn phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  {/* Option 0: Bank Transfer QR */}
                  <div 
                    onClick={() => !isOtpStep && setPaymentMethod(0)} 
                    className={`p-4 rounded-xl border flex items-start gap-3 transition ${isOtpStep ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${paymentMethod === 0 ? 'border-[#1a5f3a] bg-emerald-50/30' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <input type="radio" checked={paymentMethod === 0} disabled={isOtpStep} readOnly className="mt-1 accent-[#1a5f3a]" />
                    <div>
                      <div className="text-sm font-bold text-gray-900">Chuyển khoản Ngân hàng qua mã QR</div>
                      <div className="text-xs text-gray-500 mt-0.5">Yêu cầu xác nhận OTP và quét mã VietQR động</div>
                    </div>
                  </div>

                  {/* Option 1: Ví điện tử MoMo */}
                  <div 
                    onClick={() => !isOtpStep && setPaymentMethod(1)} 
                    className={`p-4 rounded-xl border flex items-start gap-3 transition ${isOtpStep ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${paymentMethod === 1 ? 'border-[#1a5f3a] bg-emerald-50/30' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <input type="radio" checked={paymentMethod === 1} disabled={isOtpStep} readOnly className="mt-1 accent-[#1a5f3a]" />
                    <div>
                      <div className="text-sm font-bold text-gray-900">Ví điện tử MoMo Sandbox</div>
                      <div className="text-xs text-gray-500 mt-0.5">Tự động kết nối và chuyển hướng sang cổng thanh toán MoMo thật</div>
                    </div>
                  </div>

                  {/* Option 2: COD */}
                  <div 
                    onClick={() => !isOtpStep && setPaymentMethod(2)} 
                    className={`p-4 rounded-xl border flex items-start gap-3 transition ${isOtpStep ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${paymentMethod === 2 ? 'border-[#1a5f3a] bg-emerald-50/30' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <input type="radio" checked={paymentMethod === 2} disabled={isOtpStep} readOnly className="mt-1 accent-[#1a5f3a]" />
                    <div>
                      <div className="text-sm font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</div>
                      <div className="text-xs text-gray-500 mt-0.5">Xác thực OTP qua Email và thanh toán tiền mặt khi nhận hàng</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* KHỐI HIỂN THỊ TRỰC QUAN THEO PHƯƠNG THỨC */}
              {paymentMethod === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center space-y-4">
                  <div className="font-bold text-gray-800 text-sm">MÃ QR CHUYỂN KHOẢN TẠM TÍNH</div>
                  <div className="inline-block p-3 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <img 
                      src={`https://img.vietqr.io/image/970415-123456789-qr_only.jpg?amount=${amount}&addInfo=NLSTORE%20${orderId}`} 
                      alt="Mã QR Chuyển Khoản" 
                      className="w-48 h-48 mx-auto object-contain"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 1 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#a50064] text-white font-bold rounded-2xl flex items-center justify-center text-xl shadow-inner">M</div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Cổng thanh toán MoMo Sandbox trực tuyến</div>
                    <p className="text-xs text-gray-500 mt-0.5">Hệ thống sẽ dẫn bạn đến trang chủ MoMo an toàn để quét mã thanh toán bằng tiền giả lập thử nghiệm.</p>
                  </div>
                </div>
              )}
            </div>

            {/* CỘT PHẢI: TỔNG KẾT & Ô NHẬP OTP XÁC THỰC LINH HOẠT */}
            <div className="md:col-span-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-100">📋 Tóm tắt thanh toán</h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Mã đơn hàng:</span>
                    <span className="font-mono font-bold text-gray-900">{orderId}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed pt-3 mt-2 text-base font-bold text-gray-900">
                    <span>Tổng thanh toán:</span>
                    <span className="text-lg text-[#1a5f3a]">{amount.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>

                {/* GIAO DIỆN FORM ĐỘNG QUYẾT ĐỊNH THEO TIẾN TRÌNH */}
                {!isOtpStep ? (
                  /* BƯỚC 1: CLICK ĐỂ KHỞI TẠO THANH TOÁN */
                  <form onSubmit={handlePaymentSubmit}>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-[#1a5f3a] hover:bg-[#13482a] text-white py-3.5 rounded-xl text-base font-bold transition shadow-sm disabled:bg-gray-400"
                    >
                      {isLoading ? 'Đang xử lý giao dịch...' : (paymentMethod === 1 ? 'KẾT NỐI VÍ MOMO' : 'XÁC NHẬN THANH TOÁN')}
                    </button>
                  </form>
                ) : (
                  /* BƯỚC 2: NHẬP MÃ OTP */
                  <form onSubmit={handleVerifyOtpSubmit} className="space-y-3 pt-2 border-t border-gray-100">
                    <div className="text-center">
                      <label className="block text-xs font-bold text-gray-700 mb-1">NHẬP MÃ OTP GỒM 6 CHỮ SỐ GỬI QUA MAIL</label>
                      <input 
                        type="text"
                        maxLength={6}
                        required
                        placeholder="******"
                        className="w-full p-3 border rounded-xl text-center text-xl font-bold tracking-[6px] focus:border-emerald-600 outline-none"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-xl text-base font-bold transition shadow-sm disabled:bg-gray-400"
                    >
                      {isLoading ? 'Đang xác thực OTP...' : 'XÁC NHẬN MÃ OTP CHỐT ĐƠN'}
                    </button>
                  </form>
                )}

                <div className="text-center">
                  <Link href="/cart" className="text-xs text-gray-400 hover:text-gray-600 transition">
                    Hủy giao dịch & quay lại giỏ hàng
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}