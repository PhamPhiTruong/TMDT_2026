'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type CartItem = {
  id: number;
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

type CartContextType = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  appliedDiscount: Discount;
  subtotal: number;
  finalTotal: number;
  applyDiscount: (code: string) => boolean;
  removeDiscount: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Xoài sấy dẻo', price: 120000, quantity: 2, checked: true, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716' },
    { id: 2, name: 'Chuối sấy giòn', price: 85000, quantity: 1, checked: true, image: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a' },
  ]);

  const [appliedDiscount, setAppliedDiscount] = useState<Discount>(null);

  const subtotal = cartItems
    .filter(item => item.checked)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const applyDiscount = (code: string): boolean => {
    const upper = code.trim().toUpperCase();
    let discountData: Discount = null;

    if (['NONG LAM10', 'NL10'].includes(upper)) {
      discountData = { code: upper, amount: Math.floor(subtotal * 0.1), type: 'percent' };
    } else if (['NONG LAM20', 'NL20', 'SALE20'].includes(upper)) {
      discountData = { code: upper, amount: Math.floor(subtotal * 0.2), type: 'percent' };
    } else if (upper === 'SAVE50K') {
      discountData = { code: upper, amount: 50000, type: 'fixed' };
    } else if (upper === 'FREESHIP') {
      discountData = { code: upper, amount: 30000, type: 'fixed' };
    }

    if (discountData) {
      setAppliedDiscount(discountData);
      console.log("✅ Đã áp dụng giảm giá:", discountData);
      return true;
    }
    console.log("❌ Mã không hợp lệ:", upper);
    return false;
  };

  const removeDiscount = () => setAppliedDiscount(null);

  return (
    <CartContext.Provider value={{
      cartItems,
      setCartItems,
      appliedDiscount,
      subtotal,
      finalTotal,
      applyDiscount,
      removeDiscount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};