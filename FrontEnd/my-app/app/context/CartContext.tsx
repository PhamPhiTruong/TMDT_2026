'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type CartItem = {
  id: number;        
  productId: number; 
  name: string;      
  price: number;
  quantity: number;
  checked: boolean;  
  image: string;     
};

type Discount = {
  code: string;
  amount: number;
  type: 'percent' | 'fixed';
} | null;

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
  applyDiscount: (code: string) => Promise<ApplyDiscountResponse>; 
  removeDiscount: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cấu hình Base URL khớp chính xác với @RequestMapping("/api/cart") của Backend
const API_BASE_URL = 'http://localhost:8081/api/cart';
const VOUCHER_API_URL = 'http://localhost:8081/api/v1/vouchers/validate'; 

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<Discount>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // 1. LẤY CHI TIẾT GIỎ HÀNG (Khớp với @GetMapping("/details") -> CartResponse)
  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        setCartItems([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/details`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server trả về lỗi khi lấy giỏ hàng:", errorText);
        setCartItems([]);
        return;
      }

      const rawData = await response.text();
      if (!rawData || rawData.trim() === "") {
        setCartItems([]);
        return;
      }

      let data;
      try {
        data = JSON.parse(rawData);
      } catch (parseError) {
        setCartItems([]);
        return;
      }

      console.log("Dữ liệu giỏ hàng nhận từ BE:", data);
      
      // 🌟 ĐOẠN ĐƯỢC THÊM VÀO: Bóc tách linh hoạt để đối phó với mọi kiểu cấu trúc API của Spring Boot
      let items: any[] = [];
      if (data) {
        if (data.result && Array.isArray(data.result.items)) {
          items = data.result.items;       // Cấu trúc: ApiResponse -> result -> items (Chuẩn DTO của bạn)
        } else if (data.result && Array.isArray(data.result)) {
          items = data.result;             // Cấu trúc: ApiResponse -> result là một mảng thẳng
        } else if (data.data && Array.isArray(data.data.items)) {
          items = data.data.items;         // Cấu trúc nếu trường bọc tên là "data" thay vì "result"
        } else if (Array.isArray(data.items)) {
          items = data.items;              // Cấu trúc trả thẳng về CartResponse không qua wrapper
        } else if (Array.isArray(data)) {
          items = data;                    // Trả thẳng về mảng thuần
        }
      }

      console.log("Mảng items bóc tách được sau khi xử lý wrapper:", items);
      
      // Khớp chuẩn hóa các trường thuộc tính từ CartItemResponse của Java sang Frontend hiển thị
      const normalizedItems = items.map((item: any) => ({
        id: item.cartItemId || item.id,                 // Khớp với Integer cartItemId dưới DB
        productId: item.productId,                      // Khớp với Integer productId
        name: item.productName || "Sản phẩm không tên", // Khớp với String productName
        price: Number(item.price) || 0,                 // Chuyển đổi BigDecimal sang Number trong JS
        quantity: item.quantity || 1,                   // Khớp với Integer quantity
        image: "https://via.placeholder.com/150",       // Tạm thời dùng placeholder do BE chưa trả về ảnh sản phẩm
        checked: true,                                  // Mặc định tích chọn xử lý thanh toán
      }));

      setCartItems(normalizedItems);

    } catch (error) {
      console.error("Lỗi kết nối hoặc xử lý dữ liệu giỏ hàng:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 2. THÊM SẢN PHẨM VÀO GIỎ (Khớp với @PostMapping("/add"))
  const addToCart = async (productId: number, productOptionId: number | null, quantity: number) => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Vui lòng đăng nhập để thực hiện tính năng này!");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, productOptionId, quantity }),
      });

      const rawText = await res.text();
      let result: any = {};
      if (rawText) {
        try { result = JSON.parse(rawText); } catch (e) { result = { message: rawText }; }
      }

      if (res.ok) {
        alert('✅ ' + (result.message || 'Thêm vào giỏ thành công!'));
        await fetchCart(); // Reload lại giỏ hàng đồng bộ giao diện
      } else {
        alert('❌ Lỗi: ' + (result.message || `Không thể thêm vào giỏ hàng (Mã lỗi: ${res.status})`)); 
      }
    } catch (error) {
      console.error("Lỗi kết nối add-to-cart:", error);
      alert('Không thể kết nối đến Backend!');
    }
  };

  // 3. CẬP NHẬT SỐ LƯỢNG (Khớp với @PutMapping("/update/{cartItemId}"))
  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      await deleteItem(cartItemId);
      return;
    }
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/update/${cartItemId}?quantity=${quantity}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        await fetchCart(); 
      } else {
        alert(`Cập nhật số lượng thất bại! (Mã lỗi: ${res.status})`);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
    }
  };

  // 4. XÓA SẢN PHẨM KHỎI GIỎ (Khớp với @DeleteMapping("/delete/{cartItemId}"))
  const deleteItem = async (cartItemId: number) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/delete/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        await fetchCart();
      } else {
        alert('Xóa sản phẩm khỏi giỏ hàng thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  };

  // 5. XÓA SẠCH GIỎ HÀNG (Khớp với @DeleteMapping("/clear"))
  const clearCart = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        await fetchCart();
      } else {
        alert('Không thể xóa sạch giỏ hàng!');
      }
    } catch (error) {
      console.error('Lỗi khi xóa sạch toàn bộ giỏ hàng:', error);
    }
  };

  // Tính tổng tiền các sản phẩm được tích chọn
  const subtotal = cartItems
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Áp dụng mã khuyến mãi Voucher
  const applyDiscount = async (code: string): Promise<ApplyDiscountResponse> => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(VOUCHER_API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }) 
        },
        body: JSON.stringify({ code: code.trim(), orderAmount: subtotal }),
      });

      const rawText = await res.text();
      const resData = rawText ? JSON.parse(rawText) : {};

      if (res.ok && resData.status === 'success') {
        setAppliedDiscount({ code: resData.code, amount: resData.discountAmount, type: 'fixed' });
        return { success: true, message: `Áp dụng mã ${resData.code} thành công!` };
      } else {
        return { success: false, message: resData.message || 'Mã giảm giá không hợp lệ!' };
      }
    } catch (error) {
      return { success: false, message: 'Không thể kết nối đến máy chủ Voucher!' };
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