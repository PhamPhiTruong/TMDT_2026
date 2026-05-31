'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
} from 'lucide-react';
import DeleteOrderModal from '@/components/store/orders/DeleteOrderModal';
import CreateOrderModal from '@/components/store/orders/CreateOrderModal';
import OrderStatusModal from '@/components/store/orders/OrderStatusModal';
import OrderViewModal from '@/components/store/orders/OrderViewModal';

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

const orders: Order[] = [
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
  {
    id: '#ORD006',
    customer: 'Bùi Văn F',
    amount: 890000,
    status: 'processing',
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

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);
  const [viewOpen, setViewOpen] =
    useState(false);
  const [statusOpen, setStatusOpen] =
    useState(false);
  const [deleteOpen, setDeleteOpen] =
    useState(false);
  const [createOpen, setCreateOpen] =
    useState(false);
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản Lý Đơn Hàng
          </h1>

          <p className="mt-2 text-gray-500">
            Tổng cộng {orders.length} đơn hàng
          </p>
        </div>

        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            px-5
            py-3
            text-white
            font-medium
            transition
            hover:opacity-90
          "
          onClick={() => setCreateOpen(true)}
          style={{
            backgroundColor:
              'var(--color-primary)',
          }}
        >
          <Plus size={18} />
          <span>Tạo Đơn Hàng</span>
        </button>
      </div>

      {/* KPI */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Tổng Đơn Hàng
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            126
          </p>
        </div>

        <div className="rounded-2xl bg-orange-50 p-5">
          <p className="text-sm text-gray-500">
            Chờ Xác Nhận
          </p>
          <p className="mt-2 text-2xl font-bold text-orange-600">
            12
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-5">
          <p className="text-sm text-gray-500">
            Đang Xử Lý
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            24
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-5">
          <p className="text-sm text-gray-500">
            Đã Giao
          </p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            90
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {/* Search + Filter */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hoặc khách hàng..."
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                py-3
                pl-10
                pr-4
                focus:outline-none
                focus:ring-2
                focus:ring-green-100
              "
            />
          </div>

          <select
            className="
              rounded-xl
              border
              border-gray-200
              px-4
              py-3
              text-gray-700
              focus:outline-none
            "
          >
            <option>Tất cả trạng thái</option>
            <option>Chờ xác nhận</option>
            <option>Đang xử lý</option>
            <option>Đang giao</option>
            <option>Đã giao</option>
            <option>Đã hủy</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Mã Đơn
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Khách Hàng
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Số Tiền
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Trạng Thái
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Ngày
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-gray-600">
                  Hành Động
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
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
                    ₫
                    {order.amount.toLocaleString(
                      'vi-VN'
                    )}
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
                      {
                        statusConfig[order.status]
                          .label
                      }
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
                          transition
                          hover:bg-green-50
                        "
                        onClick={() => {
                          setSelectedOrder(order);
                          setViewOpen(true);
                        }}
                      >
                        <Eye
                          size={18}
                          style={{
                            color:
                              'var(--color-primary)',
                          }}
                        />
                      </button>

                      <button
                        className="
                          rounded-lg
                          p-2
                          transition
                          hover:bg-orange-50
                        "
                        onClick={() => {
                          setSelectedOrder(order);
                          setStatusOpen(true);
                        }}
                      >
                        <Edit2
                          size={18}
                          style={{
                            color:
                              'var(--color-accent)',
                          }}
                        />
                      </button>

                      <button
                        className="
                          rounded-lg
                          p-2
                          transition
                          hover:bg-red-50
                        "
                        onClick={() => {
                          setSelectedOrder(order);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2
                          size={18}
                          className="text-red-500"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-gray-500">
            Hiển thị 1 - 10 / 126 đơn hàng
          </p>

          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">
              Trước
            </button>

            <button
              className="rounded-lg px-3 py-2 text-white"
              style={{
                backgroundColor:
                  'var(--color-primary)',
              }}
            >
              1
            </button>

            <button className="rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">
              2
            </button>

            <button className="rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">
              Sau
            </button>
          </div>
        </div>
      </div>
      <OrderViewModal
        open={viewOpen}
        order={selectedOrder}
        onClose={() => setViewOpen(false)}
      />

      <OrderStatusModal
        open={statusOpen}
        order={selectedOrder}
        onClose={() => setStatusOpen(false)}
      />

      <CreateOrderModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <DeleteOrderModal
        open={deleteOpen}
        order={selectedOrder}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => { }}
      />
    </div>
  );
}