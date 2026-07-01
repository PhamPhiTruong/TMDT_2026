'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

// 🌟 Import Header và Footer từ thư mục components
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
    addToCart: addToCartBE, 
    updateQuantity: updateQuantityBE, 
    deleteItem: deleteItemBE, 
    applyDiscount: applyDiscountFromContext,
    removeDiscount,
    clearCart
  } = useCart();

  const [discountCode, setDiscountCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const suggestedCodes = [
    { code: 'NONG LAM10', desc: 'Giảm 10% cho đơn hàng' },
    { code: 'SAVE50K', desc: 'Giảm ngay 50.000đ' },
    { code: 'NONG LAM20', desc: 'Giảm 20% tối đa 200k' },
    { code: 'FREESHIP', desc: 'Miễn phí vận chuyển' },
  ];

  // Khung bơm dữ liệu thử nghiệm (Giữ lại để bạn test bấm nút chèn vào DB)
  const suggestedProducts = [
    { 
      product_id: 1, 
      option_id: 1, 
      name: 'iPhone 15 128GB (Đen)', 
      price: 18990000, 
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
      checked: true
    },
    { 
      product_id: 3, 
      option_id: 3, 
      name: 'Áo Thun Nam Basic (Size M)', 
      price: 250000, 
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
      checked: true
    },
  ];

  // 🔄 CẬP NHẬT SỐ LƯỢNG - TỰ ĐỘNG XÓA NẾU SỐ LƯỢNG VỀ 0
  const handleUpdateQuantity = async (item: any, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    const realId = item.cartItemId || item.id || item.product_id;

    if (!realId) {
      console.error("Không tìm thấy ID hợp lệ:", item);
      return;
    }

    if (newQty < 1) {
      if (confirm(`Bạn có muốn xóa sản phẩm "${item.productName || 'này'}" khỏi giỏ hàng không?`)) {
        await deleteItemBE(Number(realId));
      }
      return; 
    }
    
    await updateQuantityBE(Number(realId), newQty);
  };

  const handleClearCart = async () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng đã trống sẵn rồi bạn ơi!");
      return;
    }

    if (confirm("Bạn có chắc chắn muốn XÓA SẠCH TOÀN BỘ sản phẩm trong giỏ hàng thực tế dưới DB không?")) {
      if (clearCart) {
        await clearCart();
      } else {
        alert("Hãy check lại tên hàm xóa sạch trong CartContext.tsx nha!");
      }
    }
  };

  const handleRemoveItem = async (item: any) => {
    const realId = item.cartItemId || item.id || item.product_id;

    if (!realId) {
      console.error("Không tìm thấy ID để xóa:", item);
      alert("Lỗi: Không tìm thấy ID sản phẩm này!");
      return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${item.productName || 'này'}" khỏi giỏ hàng?`)) {
      await deleteItemBE(Number(realId));
    }
  };

  // 🎯 SỬA LỖI TICK 1 CÁI BỊ TICK CẢ ĐÔI
  const toggleItem = (itemToToggle: any) => {
    const targetId = itemToToggle.cartItemId || itemToToggle.id || itemToToggle.product_id;

    setCartItems((prev: any[]) =>
      prev.map(item => {
        const currentId = item.cartItemId || item.id || item.product_id;
        return currentId === targetId ? { ...item, checked: !item.checked } : item;
      })
    );
  };

  const toggleAll = () => {
    const allChecked = cartItems.length > 0 && cartItems.every((item: any) => item.checked);
    setCartItems((prev: any[]) => prev.map(item => ({ ...item, checked: !allChecked })));
  };

  // 🚀 BẤM NÚT ĐỂ TỰ ĐỘNG INSERT VÀO DB THẬT
  const handleAddToCart = async (product: any) => {
    await addToCartBE(product.product_id, product.option_id, 1); 
  };
const handleApplyDiscount = async (codeInput?: string) => {
  const code = (codeInput || discountCode).trim();
  if (!code) {
    setMessage({ type: 'error', text: 'Vui lòng nhập hoặc chọn mã' });
    return;
  }

  // Thêm await vì hàm applyDiscount trong Context bây giờ đã gọi API thật
  const result = await applyDiscountFromContext(code);
  
  if (result.success) {
    setMessage({ type: 'success', text: result.message });
    setDiscountCode('');
  } else {
    setMessage({ type: 'error', text: result.message });
  }
};

  const handleRemoveDiscount = () => {
    removeDiscount();
    setMessage(null);
  };

  return (
    <>
      {/* 🌟 1. HIỂN THỊ HEADER Ở TRÊN CÙNG */}
      <Header />

      {/* 2. NỘI DUNG CHÍNH CỦA GIỎ HÀNG */}
      <div className="bg-[#f8f9fa] min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#1a5f3a] mb-8">Giỏ hàng</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden relative">
                
                {loading && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 font-medium text-[#1a5f3a]">
                    Đang đồng bộ dữ liệu với Database...
                  </div>
                )}

                <div className="grid grid-cols-12 px-6 py-4 bg-[#f8f9fa] border-b text-sm font-medium text-gray-600">
                  <div className="col-span-6 flex items-center gap-3">
                    <input type="checkbox" checked={cartItems.length > 0 && cartItems.every((item: any) => item.checked)} onChange={toggleAll} className="w-5 h-5 accent-[#1a5f3a]" />
                    <span>Chọn tất cả ({cartItems.length})</span>
                  </div>
                  
                  {/* 🌟 NÚT XÓA TẤT CẢ */}
                  {cartItems.length > 0 && (
                    <button 
                      onClick={handleClearCart}
                      className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors"
                    >
                      💥 Xóa tất cả
                    </button>
                  )}
                  <div className="col-span-2 text-center">Đơn giá</div>
                  <div className="col-span-2 text-center">Số lượng</div>
                  <div className="col-span-2 text-center">Thành tiền</div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    Giỏ hàng trống! Hãy thử thêm sản phẩm  phía dưới.
                  </div>
                ) : (
                  cartItems.map((item: any) => (
                    <div key={item.cartItemId} className="grid grid-cols-12 px-6 py-6 border-b last:border-none items-center hover:bg-gray-50">
                      <div className="col-span-6 flex items-center gap-4">
                        <input 
                          type="checkbox" 
                          checked={item.checked} 
                          onChange={() => toggleItem(item)} 
                          className="w-5 h-5 accent-[#1a5f3a]" 
                        />
                        
                        <img src={item.productImage || item.image || 'https://via.placeholder.com/150'} alt={item.productName} className="w-20 h-20 object-cover rounded-xl border" />
                        
                        <div>
                          <h3 className="font-semibold text-gray-800">{item.productName || "Sản phẩm ẩn danh"}</h3>
                          <p className="text-xs text-gray-400 mt-1">Mã giỏ hàng: {item.cartItemId}</p>
                          
                          <button 
                            onClick={() => handleRemoveItem(item)} 
                            className="text-red-500 hover:text-red-600 text-sm mt-2 flex items-center gap-1"
                          >
                            🗑 Xóa
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-span-2 text-center font-semibold text-[#1a5f3a]">{(item.price || 0).toLocaleString()}đ</div>
                      
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                          <button onClick={() => handleUpdateQuantity(item, item.quantity, -1)} className="px-4 py-2 hover:bg-gray-100">−</button>
                          <div className="px-6 py-2 font-medium border-x">{item.quantity}</div>
                          <button onClick={() => handleUpdateQuantity(item, item.quantity, 1)} className="px-4 py-2 hover:bg-gray-100">+</button>
                        </div>
                      </div>
                      
                      <div className="col-span-2 text-center font-bold text-lg">
                        {((item.price || 0) * (item.quantity || 1)).toLocaleString()}đ
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* ========== KHUNG MỒI SẢN PHẨM NHANH ========== */}
              <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-xl text-[#1a5f3a] mb-5">Các sản phẩm khác</h3>
                <div className="grid grid-cols-2 gap-4">
                  {suggestedProducts.map((product, index) => (
                    <div key={`${product.product_id}-${index}`} className="border border-gray-200 rounded-2xl p-3 hover:border-[#1a5f3a] transition-all group">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform"
                      />
                      <h4 className="font-medium text-sm text-gray-800">{product.name}</h4>
                      <p className="text-xs text-gray-400">ID Sản phẩm: {product.product_id} | Option: {product.option_id}</p>
                      <p className="text-[#1a5f3a] font-bold mt-1">{product.price.toLocaleString()}đ</p>
                      
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="mt-3 w-full text-xs py-2 bg-[#1a5f3a] text-white rounded-xl hover:bg-[#13482a] transition"
                      >
                        Thêm vào giỏ (Gửi BE thật)
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
                
                <Link href="/order">
                  <button className="w-full bg-[#1a5f3a] hover:bg-[#13482a] text-white font-semibold py-4 rounded-2xl text-lg transition">
                    TIẾN HÀNH THANH TOÁN
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 3. HIỂN THỊ FOOTER Ở DƯỚI CÙNG */}
      <Footer />
    </>
  );
}