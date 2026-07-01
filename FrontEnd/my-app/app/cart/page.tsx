'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { 
    cartItems, 
    setCartItems, 
    appliedDiscount, 
    subtotal, 
    finalTotal,
    loading, 
    fetchCart, 
    addToCart: addToCartBE, 
    updateQuantity: updateQuantityBE, 
    deleteItem: deleteItemBE, 
    applyDiscount: applyDiscountFromContext,
    removeDiscount,
    clearCart
  } = useCart();

  const [discountCode, setDiscountCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (fetchCart) {
      fetchCart();
    }
  }, []);

  const suggestedCodes = [
    { code: 'NONG LAM10', desc: 'Giảm 10% cho đơn hàng' },
    { code: 'SAVE50K', desc: 'Giảm ngay 50.000đ' },
    { code: 'NONG LAM20', desc: 'Giảm 20% tối đa 200k' },
    { code: 'FREESHIP', desc: 'Miễn phí vận chuyển' },
  ];

  const suggestedProducts = [
    { 
      product_id: 1, 
      option_id: null, 
      name: 'Sản phẩm thử nghiệm 1', 
      price: 150000, 
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
      checked: true
    },
    { 
      product_id: 2, 
      option_id: null, 
      name: 'Sản phẩm thử nghiệm 2', 
      price: 250000, 
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
      checked: true
    },
  ];

  const handleUpdateQuantity = async (item: any, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    const realId = item.id; 

    if (!realId) return;

    if (newQty < 1) {
      if (confirm(`Bạn có muốn xóa sản phẩm "${item.name || 'này'}" khỏi giỏ hàng không?`)) {
        await deleteItemBE(Number(realId));
      }
      return; 
    }
    
    await updateQuantityBE(Number(realId), newQty);
  };

  const handleClearCart = async () => {
    if (cartItems.length === 0) return;
    if (confirm("Bạn có chắc chắn muốn xóa sạch toàn bộ sản phẩm trong giỏ hàng?")) {
      if (clearCart) await clearCart();
    }
  };

  const handleRemoveItem = async (item: any) => {
    const realId = item.id;
    if (!realId) return;
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${item.name || 'này'}"?`)) {
      await deleteItemBE(Number(realId));
    }
  };

  const toggleItem = (itemToToggle: any) => {
    const targetId = itemToToggle.id;
    setCartItems((prev: any[]) =>
      prev.map(item => item.id === targetId ? { ...item, checked: !item.checked } : item)
    );
  };

  const toggleAll = () => {
    const allChecked = cartItems.length > 0 && cartItems.every((item: any) => item.checked);
    setCartItems((prev: any[]) => prev.map(item => ({ ...item, checked: !allChecked })));
  };

  const handleAddToCart = async (product: any) => {
    await addToCartBE(product.product_id, product.option_id, 1); 
  };

  const handleApplyDiscount = async (codeInput?: string) => {
    const code = (codeInput || discountCode).trim();
    if (!code) {
      setMessage({ type: 'error', text: 'Vui lòng nhập hoặc chọn mã' });
      return;
    }

    const result = await applyDiscountFromContext(code);
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setDiscountCode('');
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfd]">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-10 lg:py-14">
        {/* Tiêu đề trang */}
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Giỏ Hàng</h1>
          <span className="bg-[#1a5f3a]/10 text-[#1a5f3a] text-sm font-semibold px-3 py-1 rounded-full">
            {cartItems.length} sản phẩm
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI: CHI TIẾT GIỎ HÀNG & GỢI Ý */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
              {/* Lớp loading phủ mượt mà */}
              {loading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex flex-col gap-3 items-center justify-center z-20 transition-all">
                  <div className="w-8 h-8 border-4 border-[#1a5f3a] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-[#1a5f3a]">Đang cập nhật giỏ hàng...</p>
                </div>
              )}

              {/* Thanh điều khiển trên cùng */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-600">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={cartItems.length > 0 && cartItems.every((item: any) => item.checked)} 
                    onChange={toggleAll} 
                    className="w-5 h-5 rounded-md border-gray-300 text-[#1a5f3a] focus:ring-[#1a5f3a] transition accent-[#1a5f3a] cursor-pointer" 
                  />
                  <span>Chọn tất cả</span>
                </label>
                
                {cartItems.length > 0 && (
                  <button 
                    onClick={handleClearCart}
                    className="text-gray-400 hover:text-red-500 font-medium flex items-center gap-1.5 transition-colors text-xs bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-200"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v4M4 7h16" />
                    </svg>
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* Danh sách sản phẩm */}
              {cartItems.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">Giỏ hàng của bạn đang trống</p>
                  <Link href="/" className="inline-block mt-4 text-sm font-semibold text-[#1a5f3a] hover:underline">
                    Tiếp tục mua sắm &rarr;
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                      {/* Checkbox & Ảnh */}
                      <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                        <input 
                          type="checkbox" 
                          checked={item.checked} 
                          onChange={() => toggleItem(item)} 
                          className="w-5 h-5 rounded-md border-gray-300 text-[#1a5f3a] focus:ring-[#1a5f3a] accent-[#1a5f3a] cursor-pointer" 
                        />
                        <div className="w-20 h-20 relative flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                          <img 
                            src={item.image || 'https://via.placeholder.com/150'} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        {/* Thông tin tên */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 hover:text-[#1a5f3a] transition-colors">
                            {item.name || "Sản phẩm không tên"}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">Mã: #{item.id}</p>
                          <div className="sm:hidden mt-2 font-bold text-gray-900">
                            {((item.price || 0) * (item.quantity || 1)).toLocaleString()}đ
                          </div>
                        </div>
                      </div>

                      {/* Giá, Số lượng, Thành tiền */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-none border-gray-100">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-semibold text-gray-900">{(item.price || 0).toLocaleString()}đ</p>
                        </div>

                        {/* Bộ tăng giảm số lượng */}
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white h-9 overflow-hidden shadow-sm">
                          <button 
                            onClick={() => handleUpdateQuantity(item, item.quantity, -1)} 
                            className="px-3 text-gray-500 hover:bg-gray-50 font-medium transition h-full"
                          >
                            −
                          </button>
                          <span className="w-10 text-center text-sm font-semibold text-gray-800 flex items-center justify-center h-full border-x border-gray-100">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleUpdateQuantity(item, item.quantity, 1)} 
                            className="px-3 text-gray-500 hover:bg-gray-50 font-medium transition h-full"
                          >
                            +
                          </button>
                        </div>

                        {/* Tổng tiền của item */}
                        <div className="text-right min-w-[100px] hidden sm:block">
                          <p className="font-bold text-gray-900 text-base">
                            {((item.price || 0) * (item.quantity || 1)).toLocaleString()}đ
                          </p>
                        </div>

                        {/* Nút xóa */}
                        <button 
                          onClick={() => handleRemoveItem(item)} 
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition"
                          title="Xóa sản phẩm"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v4M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ========== KHUNG GỢI Ý SẢN PHẨM NHANH ========== */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#1a5f3a] rounded-full inline-block"></span>
                Gợi ý cho bạn hôm nay
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suggestedProducts.map((product, index) => (
                  <div key={`${product.product_id}-${index}`} className="flex border border-gray-100 rounded-xl p-3 hover:border-[#1a5f3a]/40 hover:shadow-md transition-all bg-white group items-center gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-sm text-gray-800 truncate">{product.name}</h4>
                      <p className="text-[#1a5f3a] font-bold mt-1 text-sm">{product.price.toLocaleString()}đ</p>
                      
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="mt-2 text-xs font-semibold px-3 py-1.5 bg-[#1a5f3a]/10 text-[#1a5f3a] rounded-lg hover:bg-[#1a5f3a] hover:text-white transition-all w-full sm:w-auto text-center block"
                      >
                        Thêm nhanh
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN TỔNG ĐƠN HÀNG */}
          <div className="lg:col-span-4 lg:sticky lg:top-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Tóm tắt đơn hàng</h2>

              {/* Chi tiết giá tiền */}
              <div className="space-y-3.5 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-gray-900">{subtotal.toLocaleString()}đ</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between items-center bg-green-50 text-green-700 px-3 py-2 rounded-xl text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Mã giảm: {appliedDiscount.code}
                    </span>
                    <span className="font-bold">- {appliedDiscount.amount.toLocaleString()}đ</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Phí vận chuyển</span>
                  <span className="text-gray-400 italic text-xs">Tính khi thanh toán</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 my-4" />

              {/* Nhập mã giảm giá */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mã giảm giá</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã ưu đãi..."
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    disabled={!!appliedDiscount}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#1a5f3a] focus:ring-1 focus:ring-[#1a5f3a] outline-none disabled:bg-gray-50 transition"
                  />
                  {!appliedDiscount ? (
                    <button 
                      onClick={() => handleApplyDiscount()} 
                      className="px-4 text-sm font-semibold bg-[#1a5f3a] text-white rounded-xl hover:bg-[#13482a] active:scale-95 transition"
                    >
                      Áp dụng
                    </button>
                  ) : (
                    <button 
                      onClick={removeDiscount} 
                      className="px-4 text-sm font-semibold bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition"
                    >
                      Hủy
                    </button>
                  )}
                </div>

                {/* Gợi ý mã */}
                <div className="mt-3">
                  <p className="text-[11px] font-medium text-gray-400 mb-2">Mã ưu đãi có sẵn:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestedCodes.map((item) => (
                      <button
                        key={item.code}
                        onClick={() => handleApplyDiscount(item.code)}
                        disabled={!!appliedDiscount}
                        className="text-left p-2.5 border border-gray-100 bg-gray-50/50 rounded-xl hover:border-[#1a5f3a]/40 hover:bg-white transition disabled:opacity-50 group"
                      >
                        <p className="font-bold text-xs text-[#1a5f3a] group-hover:scale-[1.02] transition-transform">{item.code}</p>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {message && (
                  <div className={`p-3 rounded-xl text-xs font-medium mt-3 border ${
                    message.type === 'success' 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {message.text}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-sm font-semibold text-gray-900">Tổng thanh toán</span>
                  <span className="text-2xl font-black text-[#1a5f3a]">{finalTotal.toLocaleString()}đ</span>
                </div>
                
                <Link href="/order" className="block">
                  <button className="w-full bg-[#1a5f3a] hover:bg-[#13482a] text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] text-center text-base tracking-wide uppercase">
                    Tiến hành thanh toán
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}