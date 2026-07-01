'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '../app/data/homepageData';
import { useCart } from '../app/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { setCartItems } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.isOutOfStock || product.price === 0) return;

    // Lấy tên ngắn gọn trước dấu |
    const displayName = product.name.split('|')[0].trim();

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevItems,
        {
          id: product.id,
          name: displayName,
          price: product.price,
          quantity: 1,
          checked: true,
          image: product.image,
        },
      ];
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isContact = product.price === 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative group">
      {/* Discount Badge */}
      {product.discount && product.discount > 0 && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
          -{product.discount}%
        </span>
      )}

      {/* Product Image */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px] z-10">
            <span className="bg-gray-900/80 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Tạm hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unit / Weight */}
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            {product.unit}
          </span>
          {/* Title */}
          <h3 className="text-xs md:text-sm font-bold text-gray-800 mt-1 mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[36px]">
            {product.name}
          </h3>
        </div>

        {/* Pricing & Cart Action */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
          <div className="flex flex-col">
            {isContact ? (
              <span className="text-sm font-extrabold text-primary">Liên hệ</span>
            ) : (
              <>
                <span className="text-sm md:text-base font-extrabold text-red-600">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {product.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                )}
              </>
            )}
          </div>

          {/* Add to Cart Button */}
          {!product.isOutOfStock && !isContact ? (
            <button
              onClick={handleAddToCart}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                added
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-primary hover:bg-primary-dark text-white hover:scale-105 shadow-sm'
              }`}
              title="Thêm vào giỏ hàng"
              aria-label="Thêm vào giỏ hàng"
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
          ) : (
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 py-1 px-2.5 rounded-md">
              {isContact ? 'Liên hệ' : 'Hết hàng'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
