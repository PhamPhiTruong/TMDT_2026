'use client';

import { Grid, Calendar, BookOpen, Truck } from 'lucide-react';

interface CategorySidebarProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function CategorySidebar({ activeCategory, onSelectCategory }: CategorySidebarProps) {
  const menuItems = [
    { id: 'all', name: 'TẤT CẢ SẢN PHẨM', icon: Grid },
    { id: 'seasonal', name: 'TRÁI CÂY SẤY THEO MÙA', icon: Calendar },
    { id: 'news', name: 'TIN TỨC | MẸO VẶT', icon: BookOpen },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden self-start">
      <div className="bg-primary px-5 py-4 text-white font-bold flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        DANH MỤC SẢN PHẨM
      </div>
      
      <ul className="py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => onSelectCategory(item.id)}
                className={`w-full text-left px-5 py-3.5 flex items-center gap-3 text-sm font-medium transition-all duration-200 border-l-4 ${
                  isActive
                    ? 'bg-primary/5 text-primary border-primary'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                {item.name}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-gray-100 p-4 bg-gray-50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Truck className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-800">Giao hàng đúng giờ</p>
          <p className="text-[10px] text-gray-500">Nhanh chóng & an toàn</p>
        </div>
      </div>
    </div>
  );
}
