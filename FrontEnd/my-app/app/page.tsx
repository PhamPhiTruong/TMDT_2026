'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import CategorySidebar from '../components/CategorySidebar';
import BannerCarousel from '../components/BannerCarousel';
import VoucherCard from '../components/VoucherCard';
import ProductCard from '../components/ProductCard';

import {
  VOUCHERS,
  NEW_PRODUCTS,
  FEATURED_PRODUCTS,
  NEWS_LIST,
  Product,
} from './data/homepageData';

import { searchProducts } from '@/lib/publicProductService';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [realProducts, setRealProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await searchProducts('');
        // Map PublicProductResponse to Product interface
        const mappedProducts = data.map((p: any) => {
          // Lấy hình ảnh đầu tiên làm ảnh đại diện, nếu không có thì lấy ảnh mặc định
          const image = p.images && p.images.length > 0 ? p.images[0] : '/icons/mitsay.jpg';
          return {
            id: p.productId,
            name: p.name,
            price: p.price,
            image: image,
            unit: p.storeName || 'Sản phẩm', // Tạm dùng unit để hiển thị tên cửa hàng
            isOutOfStock: p.quantity <= 0
          };
        });
        setRealProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Xử lý bộ lọc sản phẩm dựa trên danh mục được chọn
  const getFilteredProducts = (): Product[] => {
    // Nếu chưa load xong hoặc lỗi mạng, dùng tạm mảng rỗng
    if (realProducts.length === 0 && !isLoading) {
      return []; // Thay vì FEATURED_PRODUCTS
    }
    
    // Chỉ hiển thị 12 sản phẩm ở trang chủ
    const displayProducts = realProducts.slice(0, 12);
    
    if (activeCategory === 'all') {
      return displayProducts;
    }
    if (activeCategory === 'seasonal') {
      // Lọc các sản phẩm có chữ "mùa" hoặc đại diện cho sản phẩm theo mùa
      return displayProducts.filter(
        (p) =>
          p.name.toUpperCase().includes('XOÀI') ||
          p.name.toUpperCase().includes('THANH LONG') ||
          p.name.toUpperCase().includes('CAM')
      );
    }
    return displayProducts;
  };

  const handleSelectCategory = (id: string) => {
    if (id === 'news') {
      // Cuộn mượt đến phần tin tức
      const newsSection = document.getElementById('tin-tuc-section');
      if (newsSection) {
        newsSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    setActiveCategory(id);
    // Cuộn mượt về khu vực sản phẩm tiêu biểu
    const productsSection = document.getElementById('san-pham-tieu-bieu');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Chia tách bài viết nổi bật và các bài viết phụ
  const featuredNews = NEWS_LIST[0];
  const sideNews = NEWS_LIST.slice(1);

  const filteredProducts = getFilteredProducts();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Header component */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-10 md:space-y-14">
        {/* Section 1: Hero Area (Sidebar + Carousel) */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <CategorySidebar
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />
          </div>
          <div className="lg:col-span-3">
            <BannerCarousel />
          </div>
        </section>

        {/* Section 2: Vouchers */}
        <section id="khuyen-mai" className="space-y-4">
          <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
            <h2 className="text-base md:text-lg font-extrabold text-gray-800 tracking-tight uppercase">
              Mã giảm giá độc quyền
            </h2>
            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Sparkles className="w-3 h-3" /> Siêu hời
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {VOUCHERS.map((voucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))}
          </div>
        </section>

        {/* Section 3: New Products */}
        <section className="space-y-6">
          <div className="bg-primary text-white font-extrabold px-5 py-3 rounded-2xl flex items-center justify-between shadow-sm">
            <span className="tracking-wider uppercase text-sm md:text-base">
              Sản phẩm mới nhất
            </span>
            <span className="text-[10px] md:text-xs bg-white/20 text-white px-3 py-1 rounded-full font-medium">
              Vừa cập nhật
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(realProducts.length > 0 ? realProducts.slice(12, 16) : NEW_PRODUCTS).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Section 4: Featured Products */}
        <section id="san-pham-tieu-bieu" className="space-y-6 scroll-mt-24">
          <div className="bg-primary text-white font-extrabold px-5 py-3 rounded-2xl flex items-center justify-between shadow-sm">
            <span className="tracking-wider uppercase text-sm md:text-base">
              {activeCategory === 'seasonal'
                ? 'Sản phẩm sấy theo mùa'
                : 'Sản phẩm tiêu biểu'}
            </span>
            <Link
              href="/san-pham"
              className="text-[10px] md:text-xs hover:underline flex items-center gap-1 font-medium bg-white/20 px-3 py-1 rounded-full"
            >
              Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white border border-gray-100 rounded-2xl">
              <p className="text-gray-500 text-sm font-medium">
                Không tìm thấy sản phẩm phù hợp.
              </p>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Link
              href="/san-pham"
              className="bg-white hover:bg-gray-50 text-gray-700 hover:text-primary border border-gray-200 hover:border-primary/30 font-bold px-6 py-2.5 rounded-xl text-xs md:text-sm transition-all duration-200 flex items-center gap-2 shadow-sm"
            >
              Xem toàn bộ sản phẩm
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Section 5: News */}
        <section id="tin-tuc-section" className="space-y-6 scroll-mt-24">
          <div className="bg-primary text-white font-extrabold px-5 py-3 rounded-2xl flex items-center justify-between shadow-sm">
            <span className="tracking-wider uppercase text-sm md:text-base">
              Tin tức | Mẹo vặt dinh dưỡng
            </span>
            <div className="flex items-center gap-1 text-[10px] md:text-xs font-medium">
              <BookOpen className="w-3.5 h-3.5" /> Nông Lâm Blog
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Post (Left) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between group">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-primary text-white font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {featuredNews.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 font-medium">
                    <span>Đăng bởi {featuredNews.author}</span>
                    <span>•</span>
                    <span>{featuredNews.date}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-3">
                    {featuredNews.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4">
                    {featuredNews.excerpt}
                  </p>
                </div>
                <Link
                  href={`/tin-tuc/${featuredNews.id}`}
                  className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 transition-colors"
                >
                  Đọc tiếp <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* List of side news (Right) */}
            <div className="space-y-4">
              {sideNews.map((news) => (
                <div
                  key={news.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {news.category}
                    </span>
                    <h4 className="text-xs md:text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {news.title}
                    </h4>
                    <span className="text-[10px] font-medium text-gray-400 block">
                      {news.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Link
              href="/tin-tuc"
              className="bg-white hover:bg-gray-50 text-gray-700 hover:text-primary border border-gray-200 hover:border-primary/30 font-bold px-6 py-2.5 rounded-xl text-xs md:text-sm transition-all duration-200 flex items-center gap-2 shadow-sm"
            >
              Xem tất cả tin tức
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer component */}
      <Footer />

      {/* Floating utility buttons */}
      <FloatingButtons />
    </div>
  );
}
