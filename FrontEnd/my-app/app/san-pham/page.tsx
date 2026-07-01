'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { searchProducts } from '../../lib/publicProductService';
import { Product } from '../data/homepageData';
import { Loader2 } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams ? (searchParams.get('q') || '') : '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await searchProducts(keyword);
        
        const mappedProducts = data.map((p: any) => {
          const image = p.images && p.images.length > 0 ? p.images[0] : '/icons/mitsay.jpg';
          return {
            id: p.productId,
            name: p.name,
            price: p.price,
            image: image,
            unit: p.storeName || 'Sản phẩm',
            isOutOfStock: p.quantity <= 0
          };
        });
        
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [keyword]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {keyword ? `Kết quả tìm kiếm cho "${keyword}"` : 'Tất cả sản phẩm'}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {isLoading ? 'Đang tìm kiếm...' : `Tìm thấy ${products.length} sản phẩm`}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="text-gray-400 mb-4 text-6xl">🔍</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm nào</h3>
            <p className="text-gray-500 text-sm">Vui lòng thử lại với từ khóa khác.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
