'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Check, Store, ChevronLeft, Loader2 } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getProductById, PublicProductResponse } from '../../../lib/publicProductService';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params ? parseInt(params.id as string) : 0;

  const [product, setProduct] = useState<PublicProductResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Tạm thời hiển thị trạng thái đã thêm vào giỏ hàng
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center space-y-4">
          <div className="text-gray-400 text-6xl">😕</div>
          <h1 className="text-2xl font-bold text-gray-800">Không tìm thấy sản phẩm</h1>
          <button
            onClick={() => router.back()}
            className="text-primary font-medium hover:underline"
          >
            Quay lại trang trước
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isOutOfStock = product.quantity <= 0;
  const image = product.images && product.images.length > 0 ? product.images[0] : '/icons/mitsay.jpg';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Quay lại
        </button>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Ảnh sản phẩm */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src={image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-10">
                  <span className="bg-gray-900 text-white font-bold px-4 py-2 rounded-full uppercase tracking-widest text-sm">
                    Tạm hết hàng
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Chi tiết sản phẩm */}
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  Sản phẩm chính hãng
                </span>
                {product.quantity > 0 && (
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Còn hàng ({product.quantity})
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h1>
              
              <div className="mt-4 flex items-center gap-2 bg-gray-50 w-fit px-4 py-2 rounded-xl border border-gray-100">
                <Store className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Phân phối bởi: <strong className="text-primary">{product.storeName}</strong>
                </span>
              </div>
            </div>

            <div className="border-t border-b border-gray-100 py-6">
              <div className="text-3xl md:text-4xl font-black text-red-600">
                {product.price.toLocaleString('vi-VN')}đ
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-gray-900">Mô tả sản phẩm:</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {product.description || 'Chưa có mô tả cho sản phẩm này.'}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg transition-all duration-300 shadow-md
                  ${isOutOfStock 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : added
                      ? 'bg-green-600 text-white'
                      : 'bg-primary hover:bg-primary-dark text-white hover:shadow-lg hover:-translate-y-1'
                  }`}
              >
                {added ? (
                  <>
                    <Check className="w-6 h-6" /> Đã thêm vào giỏ hàng
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" /> 
                    {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
