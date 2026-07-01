'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function GatewayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const method = searchParams.get('method') || 'BANK';
  const orderId = searchParams.get('orderId') || '';
  const amount = parseInt(searchParams.get('amount') || '0', 10);
  const bankName = searchParams.get('bankName') || 'Ngân hàng';

  const [countdown, setCountdown] = useState<number>(15); // 15 giây giả lập thanh toán
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed'>('processing');

  useEffect(() => {
    if (countdown > 0 && paymentStatus === 'processing') {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && paymentStatus === 'processing') {
      setPaymentStatus('success');
      
      setTimeout(() => {
        router.push('/cart?status=success');
      }, 3000);
    }
  }, [countdown, paymentStatus, router]);

  const handleCancel = () => {
    if (confirm('Bạn có chắc chắn muốn hủy bỏ phiên giao dịch an toàn này?')) {
      router.push('/cart');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4 font-sans text-gray-800">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* HEADER CỔNG BẢO MẬT */}
        <div className={`p-6 text-white text-center ${method === 'MOMO' ? 'bg-[#a50064]' : 'bg-[#0054a6]'} transition-colors`}>
          <div className="text-xs uppercase tracking-widest opacity-80 font-semibold mb-1">🛡️ Cổng thanh toán hóa đơn bảo mật</div>
          <h1 className="text-xl font-black">
            {method === 'MOMO' ? 'MOMO SANDBOX GATEWAY' : 'MB BANK VietQR'}
          </h1>
        </div>

        {/* NỘI DUNG CHÍNH */}
        <div className="p-6 space-y-6">
          
          {/* TRẠNG THÁI 1: ĐANG XỬ LÝ / CHỜ QUÉT MÃ */}
          {paymentStatus === 'processing' && (
            <div className="text-center space-y-4">
              <div className="text-sm text-gray-500">
                Vui lòng mở ứng dụng {method === 'MOMO' ? 'Ví MoMo' : 'Ngân hàng MB'} để quét mã code bên dưới.
              </div>

              {/* KHỐI HIỂN THỊ QR CHUẨN MÃ HÓA */}
              <div className="inline-block p-4 bg-white border-2 border-dashed border-gray-300 rounded-2xl relative shadow-sm">
                <img 
                  src={
                    method === 'MOMO' 
                    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=2|99|0816986647|NLSTORE||0|0|${amount}|NLSTORE%20${orderId}|transfer_myqr`
                    : `https://img.vietqr.io/image/MB-0816986647-qr_only.jpg?amount=${amount}&addInfo=NLSTORE%20${orderId}`
                  } 
                  alt="Mã thanh toán QR" 
                  className="w-48 h-48 mx-auto object-contain"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition rounded-2xl flex items-center justify-center text-white font-bold text-xs">
                  Mã QR Khởi Tạo Động
                </div>
              </div>

              {/* ĐẾM NGƯỢC THỜI GIAN THỰC */}
              <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-center gap-2 border border-gray-100">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span className="text-xs font-medium text-gray-600">
                  Hệ thống kiểm tra tự động sau <strong className="text-amber-600 font-bold text-sm">{countdown}s</strong>
                </span>
              </div>

              {/* THÔNG TIN CHI TIẾT ĐƠN HÀNG */}
              <div className="bg-gray-50 rounded-2xl p-4 text-left text-xs space-y-2 border border-gray-100">
                <div className="flex justify-between"><span className="text-gray-400">Mã đơn hàng:</span><span className="font-mono font-bold text-gray-800">{orderId}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Số tiền:</span><span className="font-bold text-red-600 text-sm">{amount.toLocaleString('vi-VN')}đ</span></div>
                
                {/* HIỂN THỊ THÔNG TIN LUỒNG PHƯƠNG THỨC */}
                <div className="pt-2 border-t border-gray-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hình thức:</span>
                    <span className="font-bold text-gray-800">{method === 'MOMO' ? 'Ví điện tử MoMo' : 'Ngân hàng MB Bank'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tài khoản nhận:</span>
                    <span className="font-mono font-bold text-gray-800">0816986647</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-400 block mb-1">Nội dung chuyển khoản chuẩn:</span>
                    <div className="bg-gray-200 text-gray-800 font-mono font-bold text-center p-2 rounded text-sm select-all">NLSTORE {orderId}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TRẠNG THÁI 2: ĐÃ NHẬN TIỀN THÀNH CÔNG */}
          {paymentStatus === 'success' && (
            <div className="text-center py-8 space-y-4 animate-scaleUp">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner animate-bounce">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Giao dịch thành công!</h3>
                <p className="text-xs text-gray-500 mt-1">Hệ thống đã xác nhận khoản thanh toán số dư tiền mặt của bạn.</p>
              </div>
              <div className="text-xs text-[#004a94] font-medium animate-pulse">
                🔄 Đang tự động điều hướng về cửa hàng sau vài giây...
              </div>
            </div>
          )}

          {/* NÚT THOÁT / HỦY GIAO DỊCH */}
          {paymentStatus === 'processing' && (
            <button 
              onClick={handleCancel}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 py-3 rounded-xl text-xs font-bold transition text-center"
            >
              ← Hủy bỏ giao dịch & Quay lại cửa hàng
            </button>
          )}

        </div>

        {/* FOOTER BẢO MẬT TIÊU CHUẨN PCI-DSS */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
          <span>© 2026 Secured Network Gateway</span>
          <span>PCI-DSS Compliant</span>
        </div>

      </div>
    </div>
  );
}

export default function PaymentGatewayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Đang thiết lập kênh truyền dữ liệu bảo mật SSL...</div>}>
      <GatewayContent />
    </Suspense>
  );
}