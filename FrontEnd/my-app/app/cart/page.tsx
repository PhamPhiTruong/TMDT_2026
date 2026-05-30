'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { 
    cartItems, 
    setCartItems, 
    appliedDiscount, 
    subtotal, 
    finalTotal,
    applyDiscount: applyDiscountFromContext,
    removeDiscount
  } = useCart();

  const [discountCode, setDiscountCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const suggestedCodes = [
    { code: 'NONG LAM10', desc: 'Giảm 10% cho đơn hàng' },
    { code: 'SAVE50K', desc: 'Giảm ngay 50.000đ' },
    { code: 'NONG LAM20', desc: 'Giảm 20% tối đa 200k' },
    { code: 'FREESHIP', desc: 'Miễn phí vận chuyển' },
  ];

  // Danh sách sản phẩm gợi ý (có id riêng)
  const suggestedProducts = [
    { 
      id: 3,
      name: 'Mít sấy dẻo', 
      price: 95000, 
      image: '/icons/mitsay.jpg',
      checked: true
    },
    { 
      id: 4,
      name: 'Khoai lang sấy', 
      price: 65000, 
      image: '/icons/khoailang.jpg',
      checked: true
    },
    { 
      id: 5,
      name: 'Chuối sấy mật ong', 
      price: 89000, 
      image: '/icons/chuoisaymatong.jpg',
      checked: true
    },
    { 
      id: 6,
      name: 'Thanh long sấy', 
      price: 75000, 
      image: '/icons/thanhlong.jpg',
      checked: true
    },
  ];

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleItem = (id: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const toggleAll = () => {
    const allChecked = cartItems.every(item => item.checked);
    setCartItems(prev => prev.map(item => ({ ...item, checked: !allChecked })));
  };

  // Hàm thêm sản phẩm từ gợi ý vào giỏ
  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      
      if (existing) {
        // Nếu đã có thì tăng số lượng
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Thêm mới
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    // Thông báo
    alert(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleApplyDiscount = (codeInput?: string) => {
    const code = (codeInput || discountCode).trim();
    if (!code) {
      setMessage({ type: 'error', text: 'Vui lòng nhập hoặc chọn mã' });
      return;
    }

    const success = applyDiscountFromContext(code);
    if (success) {
      setMessage({ type: 'success', text: `Áp dụng mã ${code.toUpperCase()} thành công!` });
      setDiscountCode('');
    } else {
      setMessage({ type: 'error', text: 'Mã giảm giá không hợp lệ' });
    }
  };

  const handleRemoveDiscount = () => {
    removeDiscount();
    setMessage(null);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#1a5f3a] mb-8">Giỏ hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-8">
            {/* Giỏ hàng chính */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-12 px-6 py-4 bg-[#f8f9fa] border-b text-sm font-medium text-gray-600">
                <div className="col-span-6 flex items-center gap-3">
                  <input type="checkbox" checked={cartItems.length > 0 && cartItems.every(item => item.checked)} onChange={toggleAll} className="w-5 h-5 accent-[#1a5f3a]" />
                  <span>Chọn tất cả ({cartItems.length})</span>
                </div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-center">Thành tiền</div>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-12 px-6 py-6 border-b last:border-none items-center hover:bg-gray-50">
                  <div className="col-span-6 flex items-center gap-4">
                    <input type="checkbox" checked={item.checked} onChange={() => toggleItem(item.id)} className="w-5 h-5 accent-[#1a5f3a]" />
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-600 text-sm mt-2 flex items-center gap-1">🗑 Xóa</button>
                    </div>
                  </div>
                  <div className="col-span-2 text-center font-semibold text-[#1a5f3a]">{item.price.toLocaleString()}đ</div>
                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-4 py-2 hover:bg-gray-100">−</button>
                      <div className="px-6 py-2 font-medium border-x">{item.quantity}</div>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-4 py-2 hover:bg-gray-100">+</button>
                    </div>
                  </div>
                  <div className="col-span-2 text-center font-bold text-lg">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>
                </div>
              ))}
            </div>

            {/* ========== BẠN CÓ THỂ THÍCH THÊM ========== */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-xl text-[#1a5f3a] mb-5">Bạn có thể thích thêm</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {suggestedProducts.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-2xl p-3 hover:border-[#1a5f3a] transition-all group">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform"
                    />
                    <h4 className="font-medium text-sm text-gray-800">{product.name}</h4>
                    <p className="text-[#1a5f3a] font-bold mt-1">{product.price.toLocaleString()}đ</p>
                    
                    <button 
                      onClick={() => addToCart(product)}
                      className="mt-3 w-full text-xs py-2 bg-[#1a5f3a] text-white rounded-xl hover:bg-[#13482a] transition"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-5 text-[#1a5f3a]">Thông tin đơn hàng</h2>

              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá ({appliedDiscount.code})</span>
                    <span>- {appliedDiscount.amount.toLocaleString()}đ</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>Tính sau</span>
                </div>
              </div>

              <div className="my-6 border-t border-dashed" />

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Mã giảm giá</p>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    disabled={!!appliedDiscount}
                    className="flex-1 border rounded-xl px-4 py-3 text-sm focus:border-[#1a5f3a] outline-none"
                  />
                  {!appliedDiscount ? (
                    <button onClick={() => handleApplyDiscount()} className="px-6 bg-[#1a5f3a] text-white rounded-xl hover:bg-[#13482a]">
                      Áp dụng
                    </button>
                  ) : (
                    <button onClick={handleRemoveDiscount} className="px-6 bg-red-500 text-white rounded-xl hover:bg-red-600">
                      Hủy
                    </button>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Hoặc chọn mã:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestedCodes.map((item) => (
                      <button
                        key={item.code}
                        onClick={() => handleApplyDiscount(item.code)}
                        disabled={!!appliedDiscount}
                        className="text-left p-3 border rounded-2xl hover:border-[#1a5f3a] transition disabled:opacity-50"
                      >
                        <p className="font-semibold text-[#1a5f3a]">{item.code}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {message && (
                  <p className={`text-sm mt-3 ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {message.text}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center text-2xl font-bold mb-6">
                <span>Tổng cộng</span>
                <span className="text-[#1a5f3a]">{finalTotal.toLocaleString()}đ</span>
              </div>

              <Link href="/checkout">
                <button className="w-full bg-[#1a5f3a] hover:bg-[#13482a] text-white font-semibold py-4 rounded-2xl text-lg transition">
                  TIẾN HÀNH THANH TOÁN
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}