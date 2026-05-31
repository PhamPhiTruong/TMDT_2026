'use client';

import React from 'react';
import {
  Plus,
  Eye,
  Settings,
  Ticket,
  Package,
} from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      icon: Package,
      label: 'Thêm Sản Phẩm',
      href: '/admin/products/new',
      bg: 'bg-green-50',
      iconColor: 'text-green-700',
    },
    {
      icon: Ticket,
      label: 'Tạo Voucher',
      href: '/admin/vouchers/new',
      bg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      icon: Eye,
      label: 'Xem Báo Cáo',
      href: '/admin/reports',
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Settings,
      label: 'Cài Đặt',
      href: '/admin/settings',
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Thao Tác Nhanh
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Truy cập nhanh các chức năng quản trị
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.label}
            className="
              group
              rounded-2xl
              border
              border-gray-100
              p-5
              transition-all
              hover:-translate-y-1
              hover:shadow-md
              hover:border-gray-200
            "
          >
            <div
              className={`
                ${action.bg}
                mx-auto
                mb-3
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-xl
              `}
            >
              <action.icon
                size={26}
                className={action.iconColor}
              />
            </div>

            <p className="text-sm font-medium text-gray-800">
              {action.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}