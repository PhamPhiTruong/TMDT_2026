'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Ticket,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import VoucherDetailModal from '@/components/store/voucher/VoucherDetailModal';
import VoucherFormModal from '@/components/store/voucher/VoucherFormModal';
import DeleteVoucherModal from '@/components/store/voucher/DeleteVoucherModal';
export interface Voucher {
  id: string;

  code: string;
  name: string;
  description: string;

  discountType: 'percent' | 'fixed';
  discountValue: number;

  maxDiscount?: number;
  minOrderValue: number;

  usage: number;
  limit: number;

  startDate: string;
  endDate: string;

  status: 'active' | 'inactive' | 'expired';

  createdAt: string;
}
const vouchers: Voucher[] = [
  {
    id: '#VCH001',
    code: 'GIAM10',
    name: 'Voucher giảm 10%',
    description: 'Giảm 10% toàn bộ đơn hàng',

    discountType: 'percent',
    discountValue: 10,

    maxDiscount: 50000,
    minOrderValue: 0,

    usage: 85,
    limit: 100,

    startDate: '01/05/2026',
    endDate: '30/06/2026',

    status: 'active',

    createdAt: '01/05/2026',
  },
];

const statusConfig = {
  active: {
    label: 'Đang Hoạt Động',
    color: 'bg-green-100 text-green-700',
  },
  inactive: {
    label: 'Tạm Dừng',
    color: 'bg-gray-100 text-gray-700',
  },
  expired: {
    label: 'Hết Hạn',
    color: 'bg-red-100 text-red-700',
  },
};

export default function VouchersPage() {
  const [selectedVoucher, setSelectedVoucher] =
    useState<Voucher | null>(null);

  const [detailOpen, setDetailOpen] =
    useState(false);

  const [formOpen, setFormOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [mode, setMode] = useState<
    'create' | 'edit'
  >('create');
  const activeCount = vouchers.filter(
    (v) => v.status === 'active'
  ).length;

  const inactiveCount = vouchers.filter(
    (v) => v.status === 'inactive'
  ).length;

  const expiredCount = vouchers.filter(
    (v) => v.status === 'expired'
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản Lý Voucher
          </h1>

          <p className="mt-2 text-gray-500">
            Tổng cộng {vouchers.length} voucher
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
          onClick={() => {
            setSelectedVoucher(null);
            setMode('create');
            setFormOpen(true);
          }}
          style={{
            backgroundColor: 'var(--color-primary)',
          }}
        >
          <Plus size={18} />
          <span>Tạo Voucher</span>
        </button>
      </div>

      {/* KPI */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Tổng Voucher
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {vouchers.length}
              </p>
            </div>

            <Ticket
              size={24}
              style={{
                color: 'var(--color-primary)',
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-green-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Đang Hoạt Động
              </p>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {activeCount}
              </p>
            </div>

            <CheckCircle
              size={24}
              className="text-green-600"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-yellow-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Tạm Dừng
              </p>
              <p className="mt-2 text-2xl font-bold text-yellow-600">
                {inactiveCount}
              </p>
            </div>

            <Clock
              size={24}
              className="text-yellow-600"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-red-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Hết Hạn
              </p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {expiredCount}
              </p>
            </div>

            <XCircle
              size={24}
              className="text-red-600"
            />
          </div>
        </div>
      </div>

      {/* Table */}
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
              placeholder="Tìm kiếm mã voucher hoặc code..."
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
            <option>Đang hoạt động</option>
            <option>Tạm dừng</option>
            <option>Hết hạn</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Mã
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Code
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Mô Tả
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Giảm Giá
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Đã Dùng
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Thời Gian
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Trạng Thái
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-gray-600">
                  Hành Động
                </th>
              </tr>
            </thead>

            <tbody>
              {vouchers.map((voucher) => (
                <tr
                  key={voucher.id}
                  className="
                    border-b
                    border-gray-100
                    hover:bg-gray-50
                    transition
                  "
                >
                  <td className="px-4 py-4 font-semibold text-gray-900">
                    {voucher.id}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className="font-semibold"
                      style={{
                        color:
                          'var(--color-accent)',
                      }}
                    >
                      {voucher.code}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-gray-700">
                    {voucher.description}
                  </td>

                  <td className="px-4 py-4 font-semibold text-gray-900">
                    {voucher.discountType === 'percent'
                      ? `${voucher.discountValue}%`
                      : `₫${voucher.discountValue.toLocaleString('vi-VN')}`}
                  </td>

                  <td className="px-4 py-4 text-gray-700">
                    <div className="min-w-[160px]">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{voucher.usage}</span>
                        <span>{voucher.limit}</span>
                      </div>

                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(voucher.usage / voucher.limit) * 100}%`,
                            backgroundColor: 'var(--color-primary)',
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <p>{voucher.startDate}</p>
                      <p className="text-gray-500">
                        → {voucher.endDate}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-medium
                        ${statusConfig[voucher.status].color}
                      `}
                    >
                      {
                        statusConfig[voucher.status]
                          .label
                      }
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        title="Xem"
                        className="p-2 rounded-lg hover:bg-green-50"
                        onClick={() => {
                          setSelectedVoucher(voucher);
                          setDetailOpen(true);
                        }}
                      >
                        <Eye
                          size={18}
                          style={{
                            color: 'var(--color-primary)',
                          }}
                        />
                      </button>

                      <button
                        title="Sửa"
                        className="p-2 rounded-lg hover:bg-orange-50"
                        onClick={() => {
                          setSelectedVoucher(voucher);
                          setMode('edit');
                          setFormOpen(true);
                        }}
                      >
                        <Edit2
                          size={18}
                          style={{
                            color: 'var(--color-accent)',
                          }}
                        />
                      </button>

                      <button
                        title="Xóa"
                        className="p-2 rounded-lg hover:bg-red-50"
                        onClick={() => {
                          setSelectedVoucher(voucher);
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
            Hiển thị 1 - 5 / 5 voucher
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
              Sau
            </button>
          </div>
        </div>
      </div>
      <VoucherDetailModal
        open={detailOpen}
        voucher={selectedVoucher}
        onClose={() => setDetailOpen(false)}
      />

      <VoucherFormModal
        open={formOpen}
        mode={mode}
        onClose={() => setFormOpen(false)}
      />

      <DeleteVoucherModal
        open={deleteOpen}
        voucherName={selectedVoucher?.name || ''}
        onClose={() => setDeleteOpen(false)}
        onDelete={() => { }}
      />
    </div>
  );
}