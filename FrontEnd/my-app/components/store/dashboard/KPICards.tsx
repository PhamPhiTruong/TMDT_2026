'use client';

import React from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Ticket,
} from 'lucide-react';

interface KPICard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color: string;
}

const kpiData: KPICard[] = [
  {
    title: 'Doanh Thu',
    value: '₫12,545,000',
    icon: <TrendingUp size={24} />,
    trend: 12,
    color: 'var(--color-primary)',
  },
  {
    title: 'Đơn Hàng',
    value: '342',
    icon: <ShoppingCart size={24} />,
    trend: 8,
    color: '#2563eb',
  },
  {
    title: 'Sản Phẩm',
    value: '156',
    icon: <Package size={24} />,
    trend: -2,
    color: 'var(--color-accent)',
  },
  {
    title: 'Voucher',
    value: '28',
    icon: <Ticket size={24} />,
    trend: 5,
    color: '#9333ea',
  },
];

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 mb-6">
      {kpiData.map((kpi, index) => (
        <div
          key={index}
          className="
            bg-white
            rounded-2xl
            p-6
            shadow-sm
            hover:shadow-md
            transition-all
            border-l-4
          "
          style={{
            borderLeftColor: kpi.color,
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {kpi.title}
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                {kpi.value}
              </p>

              {kpi.trend !== undefined && (
                <div className="mt-3">
                  {kpi.trend >= 0 ? (
                    <span className="text-sm font-medium text-green-600">
                      ↑ {kpi.trend}% so với tuần trước
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-red-600">
                      ↓ {Math.abs(kpi.trend)}% so với tuần trước
                    </span>
                  )}
                </div>
              )}
            </div>

            <div
              className="
                h-14
                w-14
                rounded-xl
                flex
                items-center
                justify-center
                text-white
                shadow-sm
              "
              style={{
                backgroundColor: kpi.color,
              }}
            >
              {kpi.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}