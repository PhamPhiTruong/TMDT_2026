'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Định nghĩa Type CartItem khớp với dữ liệu thực tế từ API Response của bạn
export type CartItem = {
  id: number;        // Sẽ được map từ cartItemId của BE
  productId: number; // Lưu thêm productId để thao tác nếu cần
  name: string;      // Map từ productName của BE
  price: number;
  quantity: number;
  checked: boolean;  // Trạng thái checkbox lưu ở FE
  image: string;     // Ảnh tạm thời fix cứng hoặc lấy từ BE sau này
};

type Discount = {
  code: string;
  amount: number;
  type: 'percent' | 'fixed';
} | null;

// Định nghĩa kiểu dữ liệu trả về cho hàm applyDiscount để thông báo ra màn hình giao diện
type ApplyDiscountResponse = {
  success: boolean;
  message: string;
};

type CartContextType = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  appliedDiscount: Discount;
  subtotal: number;
  finalTotal: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, productOptionId: number | null, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  deleteItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyDiscount: (code: string) => Promise<ApplyDiscountResponse>; // 🌟 Chuyển thành hàm bất đồng bộ (Promise)
  removeDiscount: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:8081/api/v1/cart';
const VOUCHER_API_URL = 'http://localhost:8081/api/v1/vouchers/validate'; // 🌟 Thêm đường dẫn API Voucher

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<Discount>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 1. LẤY CHI TIẾT GIỎ HÀNG TỪ BACKEND (GET /details)
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/details`);
      const resData = await res.json();

      if (res.ok && resData.data) {
        // Map dữ liệu từ API Response của BE sang cấu trúc CartItem của FE
        const mappedItems: CartItem[] = resData.data.items.map((item: any) => ({
          id: item.cartItemId,
          productId: item.productId,
          name: item.productName,
          price: item.price,
          quantity: item.quantity,
          checked: true, // Mặc định khi tải lại giỏ hàng thì tích chọn hết
          image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716', // Placeholder image
        }));
        setCartItems(mappedItems);
      }
    } catch (error) {
      console.error('❌ Lỗi kết nối API lấy giỏ hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tự động load dữ liệu khi khởi chạy ứng dụng
  useEffect(() => {
    fetchCart();
  }, []);

  // 2. THÊM SẢN PHẨM VÀO GIỎ (POST /add)
  const addToCart = async (productId: number, productOptionId: number | null, quantity: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, productOptionId, quantity }),
      });
      const result = await res.json();
      if (res.ok) {
        alert('✅ ' + result.message);
        await fetchCart(); // Thành công thì làm mới giỏ hàng luôn
      } else {
        alert('❌ Lỗi: ' + result.message); // Chặn lỗi tồn kho từ BE
      }
    } catch (error) {
      alert('Không thể kết nối đến Backend!');
    }
  };

  // 3. CẬP NHẬT SỐ LƯỢNG (PUT /update/{cartItemId})
  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      await deleteItem(cartItemId);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/update/${cartItemId}?quantity=${quantity}`, {
        method: 'PUT',
      });
      if (res.ok) {
        await fetchCart(); // Cập nhật lại giỏ hàng và tổng tiền chuẩn từ BE
      } else {
        alert('Cập nhật số lượng thất bại! (Có thể vượt quá tồn kho)');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
    }
  };

  // 4. XÓA SẢN PHẨM KHỎI GIỎ (DELETE /delete/{cartItemId})
  const deleteItem = async (cartItemId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/delete/${cartItemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  };

  // 5. XÓA SẠCH GIỎ HÀNG (DELETE /clear)
  const clearCart = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/clear`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Lỗi khi xóa sạch giỏ hàng:', error);
    }
  };

  // TÍNH TOÁN TỔNG TIỀN THEO CÁC SẢN PHẨM ĐƯỢC CHỌN (CHECKED) TRÊN FE
  const subtotal = cartItems
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // 🌟 LOGIC ÁP MÃ GIẢM GIÁ GỌI ĐẾN BACKEND ĐỂ KIỂM TRA (DỮ LIỆU THẬT)
  const applyDiscount = async (code: string): Promise<ApplyDiscountResponse> => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(VOUCHER_API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }) // Đính kèm token nếu dự án của bạn có bảo mật bằng JWT
        },
        body: JSON.stringify({
          code: code.trim(),
          orderAmount: subtotal // Gửi tổng số tiền tạm tính hiện tại của giỏ để BE check điều kiện tối thiểu (minOrderValue)
        }),
      });

      const resData = await res.json().catch(() => ({}));

      // Nếu API trả về mã thành công (200 OK)
      if (res.ok && resData.status === 'success') {
        setAppliedDiscount({
          code: resData.code,
          amount: resData.discountAmount, // Số tiền được giảm chính xác tính từ BE gửi về
          type: 'fixed' // Do BE đã tính toán quy đổi ra số tiền cụ thể, chúng ta gán mặc định là trừ tiền mặt 'fixed'
        });
        
        return { success: true, message: `Áp dụng mã ${resData.code} thành công!` };
      } 
      
      // Trường hợp Backend báo lỗi (400 Bad Request, Voucher hết hạn, không đủ điều kiện tối thiểu...)
      else {
        return { 
          success: false, 
          message: resData.message || 'Mã giảm giá không hợp lệ hoặc đã hết lượt sử dụng!' 
        };
      }
    } catch (error) {
      console.error('❌ Lỗi kết nối API Voucher:', error);
      return { success: false, message: 'Không thể kết nối đến máy chủ Backend!' };
    } finally {
      setLoading(false);
    }
  };

  const removeDiscount = () => setAppliedDiscount(null);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        appliedDiscount,
        subtotal,
        finalTotal,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        deleteItem,
        clearCart,
        applyDiscount,
        removeDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};