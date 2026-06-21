'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    title: "Trái Cây Sấy Thượng Hạng",
    subtitle: "100% Tự Nhiên - Không Đường Hóa Học - Chuẩn Xuất Khẩu",
    image: "https://images.unsplash.com/photo-1596560548464-f010689b7f1e?w=1200&auto=format&fit=crop&q=80",
    buttonText: "Mua ngay",
    link: "#san-pham",
  },
  {
    id: 2,
    title: "Nông Sản Sấy Khô Sạch",
    subtitle: "Giữ Trọn Hương Vị & Dinh Dưỡng Từ Nông Trang Việt",
    image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=1200&auto=format&fit=crop&q=80",
    buttonText: "Khám phá bộ sưu tập",
    link: "#san-pham-tieu-bieu",
  },
  {
    id: 3,
    title: "Quà Tặng Sức Khỏe Cho Gia Đình",
    subtitle: "Dinh dưỡng mỗi ngày với các sản phẩm trái cây và hạt sấy khô",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1200&auto=format&fit=crop&q=80",
    buttonText: "Xem khuyến mãi",
    link: "#khuyen-mai",
  },
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[320px] md:h-[400px] rounded-2xl overflow-hidden shadow-md group">
      {/* Slides */}
      <div className="relative w-full h-full">
        {BANNERS.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.6) 30%, rgba(0, 0, 0, 0.1)), url(${banner.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white max-w-xl">
              <span className="inline-block bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-3 uppercase tracking-wider">
                Nổi bật tuần này
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold mb-3 leading-tight drop-shadow-sm">
                {banner.title}
              </h2>
              <p className="text-sm md:text-base text-gray-200 mb-6 drop-shadow-sm font-medium">
                {banner.subtitle}
              </p>
              <a
                href={banner.link}
                className="bg-white hover:bg-primary hover:text-white text-gray-900 font-bold px-6 py-2.5 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-primary/30 w-max"
              >
                {banner.buttonText}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Điều hướng mũi tên */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-20"
        aria-label="Slide trước"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-20"
        aria-label="Slide tiếp theo"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dấu chấm chỉ số */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === current ? 'bg-primary w-6' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Đi tới slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
