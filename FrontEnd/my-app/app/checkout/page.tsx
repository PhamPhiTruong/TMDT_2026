'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { 
    cartItems, 
    setCartItems, 
    subtotal, 
    finalTotal: contextFinalTotal,
    appliedDiscount, 
    applyDiscount: applyDiscountFromContext   // ← Lấy từ Context
  } = useCart();

  const [shippingMethod, setShippingMethod] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedEwallet, setSelectedEwallet] = useState('');
  const [showBankModal, setShowBankModal] = useState(false);
  const [showEwalletModal, setShowEwalletModal] = useState(false);

  const [discountCode, setDiscountCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', 
    phone: '', 
    email: '', 
    address: '',
    province: 'TP. Hồ Chí Minh', 
    district: 'Quận 7', 
    ward: '', 
    note: ''
  });

  const shippingFee = shippingMethod === 0 ? 30000 : 25000;
  const finalTotal = contextFinalTotal + shippingFee;

  const checkedItems = cartItems.filter(item => item.checked);

  // Cập nhật số lượng
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Xóa sản phẩm
  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Áp dụng mã giảm giá (sử dụng hàm từ Context)
  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      alert('Vui lòng nhập mã giảm giá!');
      return;
    }

    const success = applyDiscountFromContext(discountCode);

    if (success) {
      alert(`✅ Áp dụng mã ${discountCode.toUpperCase()} thành công!`);
      setDiscountCode('');
    } else {
      alert('❌ Mã giảm giá không hợp lệ!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Vui lòng điền đầy đủ thông tin nhận hàng!');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
    }, 1600);
  };

  const banks = [
    { name: "Vietcombank", logo: "/icons/vietcombank.webp" },
    { name: "BIDV", logo: "/icons/bidv.jpg" },
    { name: "Techcombank", logo: "/icons/techcombank.jpg" },
    { name: "ACB", logo: "/icons/acb.png" },
    { name: "MB Bank", logo: "/icons/mb.jpg" },
  ];

  const ewallets = [
    { name: "MoMo", logo: "/icons/momo.webp" },
    { name: "ZaloPay", logo: "/icons/zalopay.webp" },
    { name: "VNPay", logo: "/icons/vnpay.jpg" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/cart"
            className="px-4 py-2 border rounded-xl hover:bg-gray-100 transition font-medium"
          >
            ← Quay lại giỏ hàng
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">
              NL
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Nông Lâm Store</h1>
              <p className="text-gray-500">Thanh toán an toàn</p>
            </div>
          </div>

          <p className="text-lg font-medium">Hoàn tất đơn hàng</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-7 space-y-8">
            {/* Thông tin nhận hàng */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">📍 Thông tin nhận hàng</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Họ và tên <span className="text-red-500">*</span></label>
                    <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full border border-gray-300 rounded-2xl px-5 py-3" placeholder="Nguyễn Văn A" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-2xl px-5 py-3" placeholder="0987654321" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-2xl px-5 py-3" placeholder="example@gmail.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Địa chỉ nhận hàng <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-300 rounded-2xl px-5 py-3" placeholder="123 Đường ABC..." />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tỉnh/Thành</label>
                    <select value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value})} className="w-full border border-gray-300 rounded-2xl px-5 py-3">
                      <option>TP. Hồ Chí Minh</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quận/Huyện</label>
                    <select value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="w-full border border-gray-300 rounded-2xl px-5 py-3">
                      <option>Quận 7</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phường/Xã</label>
                    <input type="text" value={formData.ward} onChange={(e) => setFormData({...formData, ward: e.target.value})} className="w-full border border-gray-300 rounded-2xl px-5 py-3" placeholder="Phường Tân Phong" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ghi chú</label>
                  <textarea value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} className="w-full border border-gray-300 rounded-3xl px-5 py-3 h-28" placeholder="Ghi chú cho shipper..." />
                </div>
              </div>
            </div>

            {/* Đơn hàng */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">🛒 Đơn hàng ({checkedItems.length} sản phẩm)</h2>
              <div className="space-y-6">
                {checkedItems.map(item => (
                  <div key={item.id} className="flex gap-4 border-b pb-6 last:border-none">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-2xl border" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="font-semibold text-green-600 mt-1">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-9 h-9 border rounded-xl">-</button>
                        <span className="font-semibold w-6 text-center">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-9 h-9 border rounded-xl">+</button>
                        <button type="button" onClick={() => removeItem(item.id)} className="ml-auto text-red-500 text-sm">Xóa</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-sm p-8 sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Tóm tắt thanh toán</h2>

              {/* Phương thức giao hàng */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">🚚 Phương thức giao hàng</h3>
                <div className="space-y-3">
                  <div onClick={() => setShippingMethod(0)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 0 ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={shippingMethod === 0} readOnly className="accent-green-600" />
                      <div>
                        <div className="font-medium">Giao hàng nhanh</div>
                        <div className="text-sm text-gray-500">1-2 ngày • GHTK / GHN</div>
                      </div>
                    </div>
                    <div className="text-right font-semibold">30.000đ</div>
                  </div>

                  <div onClick={() => setShippingMethod(1)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 1 ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={shippingMethod === 1} readOnly className="accent-green-600" />
                      <div>
                        <div className="font-medium">Giao hàng tiêu chuẩn</div>
                        <div className="text-sm text-gray-500">2-4 ngày</div>
                      </div>
                    </div>
                    <div className="text-right font-semibold">25.000đ</div>
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">💰 Phương thức thanh toán</h3>
                <div className="space-y-3">
                  <div onClick={() => setPaymentMethod(0)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 0 ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={paymentMethod === 0} readOnly className="accent-green-600" />
                      <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                    </div>
                  </div>

                  <div onClick={() => setShowBankModal(true)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 1 ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={paymentMethod === 1} readOnly className="accent-green-600" />
                      <span className="font-medium">Chuyển khoản ngân hàng</span>
                    </div>
                    {selectedBank && <div className="mt-3 text-green-600 text-sm">✓ {selectedBank}</div>}
                  </div>

                  <div onClick={() => setShowEwalletModal(true)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 2 ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={paymentMethod === 2} readOnly className="accent-green-600" />
                      <span className="font-medium">Ví điện tử</span>
                    </div>
                    {selectedEwallet && <div className="mt-3 text-green-600 text-sm">✓ {selectedEwallet}</div>}
                  </div>
                </div>
              </div>

              {/* Mã giảm giá + Tổng tiền */}
              <div className="border-t pt-6">
                <div className="flex gap-2 mb-6">
                  <input 
                    type="text" 
                    value={discountCode} 
                    onChange={(e) => setDiscountCode(e.target.value)} 
                    placeholder="Nhập mã giảm giá" 
                    className="flex-1 border border-gray-300 rounded-2xl px-5 py-3" 
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyDiscount} 
                    className="bg-green-600 text-white px-6 rounded-2xl hover:bg-green-700 transition"
                  >
                    Áp dụng
                  </button>
                </div>

                <div className="space-y-3 text-lg">
                  <div className="flex justify-between"><span>Tạm tính</span><span>{subtotal.toLocaleString('vi-VN')}đ</span></div>
                  <div className="flex justify-between"><span>Phí vận chuyển</span><span>{shippingFee.toLocaleString('vi-VN')}đ</span></div>
                  
                  {appliedDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá ({appliedDiscount.code})</span>
                      <span>-{appliedDiscount.amount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}

                  <div className="flex justify-between text-2xl font-bold border-t pt-4">
                    <span>Tổng cộng</span>
                    <span className="text-green-600">{finalTotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-xl font-semibold">
                {isLoading ? 'Đang xử lý...' : `Đặt hàng - ${finalTotal.toLocaleString('vi-VN')}đ`}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal Ngân hàng và Ví điện tử giữ nguyên */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-6">Chọn ngân hàng</h3>
            <div className="grid grid-cols-2 gap-4">
              {banks.map((bank, i) => (
                <div key={i} onClick={() => {
                  setSelectedBank(bank.name);
                  setPaymentMethod(1);
                  setShowBankModal(false);
                }} className="border rounded-2xl p-4 cursor-pointer hover:border-green-500 hover:bg-green-50 transition flex flex-col items-center gap-3">
                  <img src={bank.logo} alt={bank.name} className="h-12 object-contain" />
                  <span className="font-medium">{bank.name}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowBankModal(false)} className="mt-6 w-full py-3 border rounded-2xl hover:bg-gray-100">Đóng</button>
          </div>
        </div>
      )}

      {showEwalletModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Chọn ví điện tử</h3>
            <div className="grid grid-cols-3 gap-4">
              {ewallets.map((wallet, i) => (
                <div key={i} onClick={() => {
                  setSelectedEwallet(wallet.name);
                  setPaymentMethod(2);
                  setShowEwalletModal(false);
                }} className="border rounded-2xl p-4 cursor-pointer hover:border-green-500 hover:bg-green-50 flex flex-col items-center gap-2">
                  <img src={wallet.logo} alt={wallet.name} className="w-12 h-12 object-contain" />
                  <span className="text-sm font-medium">{wallet.name}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowEwalletModal(false)} className="mt-6 w-full py-3 border rounded-2xl hover:bg-gray-100">Đóng</button>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 text-center max-w-md">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">Đặt hàng thành công!</h2>
            <p className="text-gray-600 mb-8">Cảm ơn bạn đã mua hàng tại Nông Lâm Store</p>
            <button 
              onClick={() => window.location.href = '/'} 
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}