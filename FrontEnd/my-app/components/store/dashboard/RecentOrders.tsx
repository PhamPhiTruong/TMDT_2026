'use client';

import React from 'react';
import { Eye, Edit2 } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  amount: number;
  status:
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
  date: string;
}

const recentOrders: Order[] = [
  {
    id: '#ORD001',
    customer: 'Nguyễn Văn A',
    amount: 450000,
    status: 'delivered',
    date: '31/05/2026',
  },
  {
    id: '#ORD002',
    customer: 'Trần Thị B',
    amount: 320000,
    status: 'shipped',
    date: '31/05/2026',
  },
  {
    id: '#ORD003',
    customer: 'Lê Văn C',
    amount: 580000,
    status: 'processing',
    date: '30/05/2026',
  },
  {
    id: '#ORD004',
    customer: 'Phạm Thị D',
    amount: 210000,
    status: 'pending',
    date: '30/05/2026',
  },
  {
    id: '#ORD005',
    customer: 'Vũ Văn E',
    amount: 760000,
    status: 'delivered',
    date: '29/05/2026',
  },
];

const statusConfig = {
  pending: {
    label: 'Chờ Xác Nhận',
    color: 'bg-orange-100 text-orange-700',
  },
  processing: {
    label: 'Đang Xử Lý',
    color: 'bg-blue-100 text-blue-700',
  },
  shipped: {
    label: 'Đang Giao',
    color: 'bg-purple-100 text-purple-700',
  },
  delivered: {
    label: 'Đã Giao',
    color: 'bg-green-100 text-green-700',
  },
  cancelled: {
    label: 'Đã Hủy',
    color: 'bg-red-100 text-red-700',
  },
};

export default function RecentOrders() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Đơn Hàng Gần Đây
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Các đơn hàng mới nhất trong hệ thống
          </p>
        </div>

        <a
          href="/store/orders"
          className="
            text-sm
            font-medium
            text-[var(--color-primary)]
            hover:underline
          "
        >
          Xem tất cả →
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Mã Đơn
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Khách Hàng
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Số Tiền
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Trạng Thái
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Ngày
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Hành Động
              </th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="
                  border-b
                  border-gray-100
                  transition
                  hover:bg-gray-50
                "
              >
                <td className="px-4 py-4 font-semibold text-gray-900">
                  {order.id}
                </td>

                <td className="px-4 py-4 text-gray-700">
                  {order.customer}
                </td>

                <td className="px-4 py-4 font-semibold text-gray-900">
                  ₫{order.amount.toLocaleString('vi-VN')}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-medium
                      ${statusConfig[order.status].color}
                    `}
                  >
                    {statusConfig[order.status].label}
                  </span>
                </td>

                <td className="px-4 py-4 text-gray-500">
                  {order.date}
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      className="
                        rounded-lg
                        p-2
                        hover:bg-green-50
                        transition
                      "
                    >
                      <Eye
                        size={18}
                        className="text-[var(--color-primary)]"
                      />
                    </button>

                    <button
                      className="
                        rounded-lg
                        p-2
                        hover:bg-orange-50
                        transition
                      "
                    >
                      <Edit2
                        size={18}
                        className="text-[var(--color-accent)]"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}