'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const voucherData = [
  {
    name: 'Giảm 10%',
    usage: 85,
    color: '#2e7d32',
  },
  {
    name: 'Giảm 20%',
    usage: 62,
    color: '#43a047',
  },
  {
    name: 'Giảm 30%',
    usage: 45,
    color: '#f97316',
  },
  {
    name: 'Free Ship',
    usage: 38,
    color: '#3b82f6',
  },
  {
    name: 'Combo',
    usage: 28,
    color: '#8b5cf6',
  },
];

export default function VoucherOverview() {
  const totalUsage = voucherData.reduce(
    (sum, item) => sum + item.usage,
    0
  );

  const topVoucher = voucherData.reduce((a, b) =>
    a.usage > b.usage ? a : b
  );

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Hiệu Quả Voucher
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Thống kê số lần sử dụng voucher
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-orange-50 p-4">
          <p className="text-sm text-gray-500">
            Tổng Lượt Sử Dụng
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {totalUsage}
          </p>
        </div>

        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-sm text-gray-500">
            Voucher Hiệu Quả Nhất
          </p>

          <p className="mt-1 text-lg font-semibold text-gray-900">
            {topVoucher.name}
          </p>

          <p className="text-sm text-green-700">
            {topVoucher.usage} lượt sử dụng
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={voucherData}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="name"
            tick={{ fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow:
                '0 4px 12px rgba(0,0,0,0.08)',
            }}
            formatter={(value) => [
              `${value} lượt`,
              'Sử dụng',
            ]}
          />

          <Bar
            dataKey="usage"
            radius={[8, 8, 0, 0]}
          >
            {voucherData.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.color}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Voucher List */}
      <div className="mt-6 space-y-3">
        {voucherData.map((voucher) => (
          <div
            key={voucher.name}
            className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-gray-100
              p-3
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: voucher.color,
                }}
              />

              <span className="font-medium text-gray-700">
                {voucher.name}
              </span>
            </div>

            <span className="font-semibold text-gray-900">
              {voucher.usage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}