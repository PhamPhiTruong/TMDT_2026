
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function BankQrGateway({
  orderId,
  amount,
  bin,
  bankCode,
  onBack
}: {
  orderId: string;
  amount: number;
  bin: string;
  bankCode: string;
  onBack: () => void;
}) {
  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white rounded-3xl border border-gray-100 text-center shadow-2xl">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Quét mã VietQR
      </h3>

      <p className="text-sm text-gray-500 mb-4">
        Thanh toán qua {bankCode}
      </p>

      <p className="text-3xl font-bold text-emerald-600 mb-6">
        {amount.toLocaleString('vi-VN')} VND
      </p>

      <div className="inline-block p-4 border rounded-2xl bg-white shadow-md mb-5">
        <img
          src={`https://img.vietqr.io/image/${bin}-123456789-qr_only.jpg?amount=${amount}&addInfo=NLSTORE%20${orderId}`}
          alt="VietQR"
          className="w-56 h-56 mx-auto"
        />
      </div>

      <div className="text-left text-sm bg-gray-50 p-4 rounded-xl mb-5">
        <div>
          <b>Nội dung CK:</b>{' '}
          <span className="font-mono text-blue-600 font-bold select-all">
            NLSTORE {orderId}
          </span>
        </div>
      </div>

      <button
        onClick={onBack}
        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
      >
        ← Quay lại chọn phương thức khác
      </button>
    </div>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get('orderId') || '';
  const amount = parseInt(searchParams.get('amount') || '0', 10);

  const [paymentMethod, setPaymentMethod] = useState<number>(0);
  const [selectedBank, setSelectedBank] = useState({
    code: 'VCB',
    bin: '970436'
  });

  const [showQr, setShowQr] = useState<boolean>(false);
  const [isOtpStep, setIsOtpStep] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const banks = [
    { code: 'VCB', bin: '970436', name: 'Vietcombank', logo: '/icons/vietcombank.webp' },
    { code: 'TCB', bin: '970407', name: 'Techcombank', logo: '/icons/techcombank.jpg' },
    { code: 'MB', bin: '970422', name: 'MB Bank', logo: '/icons/mb.jpg' },
    { code: 'CTG', bin: '970415', name: 'VietinBank', logo: '/icons/vietinbank.png' },
    { code: 'BIDV', bin: '970418', name: 'BIDV', logo: '/icons/bidv.jpg' },
    { code: 'ACB', bin: '970416', name: 'ACB', logo: '/icons/acb.png' }
  ];

  useEffect(() => {
    if (!orderId) router.push('/cart');
  }, [orderId, router]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (paymentMethod === 0) {
      setShowQr(true);
      return;
    }

    if (paymentMethod === 1) {
      setMessage('🔄 Đang chuyển hướng sang cổng MoMo Sandbox...');
      setTimeout(() => {
        window.location.href = `https://test-payment.momo.vn/v2/gateway/api/payment/pay?s=7b9e07bd62923cfb8b0e51381389ea5c&amt=${amount}&id=${orderId}`;
      }, 1000);
      return;
    }

    try {
      const token =
        localStorage.getItem('token') || localStorage.getItem('accessToken');

      const response = await fetch(
        `http://localhost:8081/api/v1/orders/${orderId}/payment-request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ paymentMethod: 'COD' })
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        (data.status === 'PENDING_OTP' ||
          data.result?.status === 'PENDING_OTP')
      ) {
        setMessage('📩 Vui lòng kiểm tra OTP trong email!');
        setIsOtpStep(true);
      } else if (response.ok) {
        router.push('/cart?status=success');
      } else {
        setMessage(
          `❌ Thất bại: ${data.message || 'Lỗi xử lý hệ thống'}`
        );
      }
    } catch {
      setMessage('❌ Không thể kết nối tới Backend!');
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem('token') || localStorage.getItem('accessToken');

      const response = await fetch(
        `http://localhost:8081/api/v1/orders/${orderId}/payment-verify?otpCode=${otpCode}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.ok) {
        router.push('/cart?status=success');
      } else {
        setMessage('❌ Mã OTP không chính xác!');
      }
    } catch {
      setMessage('❌ Lỗi kết nối!');
    }
  };

  if (showQr) {
    return (
      <BankQrGateway
        orderId={orderId}
        amount={amount}
        bin={selectedBank.bin}
        bankCode={selectedBank.code}
        onBack={() => setShowQr(false)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {message && (
        <div className="mb-5 p-4 rounded-xl bg-blue-50 text-blue-700 text-sm text-center border border-blue-100">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Payment methods */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Chọn phương thức thanh toán
          </h2>

          <div className="space-y-4">
            {/* VietQR */}
            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                checked={paymentMethod === 0}
                onChange={() => setPaymentMethod(0)}
              />
              <img
                src="/icons/vietqr.png"
                className="w-8 h-8"
                alt="VietQR"
              />
              <span className="text-sm font-medium">Chuyển khoản VietQR</span>
            </label>

            {paymentMethod === 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {banks.map((bank) => (
                  <div
                    key={bank.code}
                    onClick={() =>
                      setSelectedBank({
                        code: bank.code,
                        bin: bank.bin
                      })
                    }
                    className={`border rounded-xl p-3 cursor-pointer text-center transition-all ${
                      selectedBank.code === bank.code
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      className="w-10 h-10 mx-auto mb-2 object-contain"
                    />
                    <p className="text-xs font-medium">{bank.name}</p>
                  </div>
                ))}
              </div>
            )}

            {/* MoMo */}
            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                checked={paymentMethod === 1}
                onChange={() => setPaymentMethod(1)}
              />
              <img src="/icons/momo.webp" className="w-8 h-8" alt="MoMo" />
              <span className="text-sm font-medium">Ví MoMo Sandbox</span>
            </label>

            {/* COD */}
            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                checked={paymentMethod === 2}
                onChange={() => setPaymentMethod(2)}
              />
              <img src="/icons/cod.png" className="w-8 h-8" alt="COD" />
              <span className="text-sm font-medium">
                Thanh toán COD (OTP Email)
              </span>
            </label>
          </div>
        </div>

        {/* Order info */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-4">
              Thông tin đơn hàng
            </h3>

            <p className="text-sm text-gray-500">
              Mã đơn:
              <span className="font-mono ml-2 text-gray-800">{orderId}</span>
            </p>

            <p className="text-3xl font-bold text-emerald-700 mt-4">
              {amount.toLocaleString('vi-VN')}đ
            </p>
          </div>

          <div className="mt-8">
            {!isOtpStep ? (
              <form onSubmit={handlePaymentSubmit}>
                <button
                  type="submit"
                  className="w-full bg-emerald-700 text-white py-3 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all"
                >
                  {paymentMethod === 0
                    ? 'TẠO MÃ QUÉT QR'
                    : 'TIẾP TỤC THANH TOÁN'}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleVerifyOtpSubmit}
                className="space-y-3"
              >
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Nhập 6 số OTP"
                  className="w-full p-3 border rounded-xl text-center font-bold outline-none"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />

                <button
                  type="submit"
                  className="w-full bg-emerald-700 text-white py-3 rounded-xl text-sm font-bold"
                >
                  XÁC NHẬN OTP
                </button>
              </form>
            )}

            <Link
              href="/cart"
              className="block text-center text-xs text-gray-400 hover:underline mt-4"
            >
              Hủy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="p-10 text-center text-sm text-gray-500">
            Đang tải cấu hình...
          </div>
        }
      >
        <PaymentContent />
      </Suspense>
      <Footer />
    </>
  );
}

