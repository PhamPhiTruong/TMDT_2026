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
} from 'recharts';

const productData = [
  { name: 'Cà Chua Sấy', sales: 240, revenue: 2400 },
  { name: 'Mận Sấy', sales: 180, revenue: 2210 },
  { name: 'Cam Sấy', sales: 290, revenue: 2290 },
  { name: 'Kiwi Sấy', sales: 150, revenue: 2000 },
  { name: 'Dâu Sấy', sales: 220, revenue: 2290 },
];

export default function ProductOverview() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Sản Phẩm Bán Chạy
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Top sản phẩm có doanh số cao nhất tháng này
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={productData}
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
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
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
          />

          <Bar
            dataKey="sales"
            name="Số lượng bán"
            fill="#2e7d32"
            radius={[6, 6, 0, 0]}
          />

          <Bar
            dataKey="revenue"
            name="Doanh thu"
            fill="#f97316"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-sm text-gray-500">
            Sản phẩm bán chạy nhất
          </p>

          <p className="mt-1 font-semibold text-gray-900">
            Cam Sấy
          </p>

          <p className="text-sm text-green-700">
            290 sản phẩm
          </p>
        </div>

        <div className="rounded-xl bg-orange-50 p-4">
          <p className="text-sm text-gray-500">
            Doanh thu cao nhất
          </p>

          <p className="mt-1 font-semibold text-gray-900">
            Mận Sấy
          </p>

          <p className="text-sm text-orange-700">
            ₫2,210,000
          </p>
        </div>
      </div>
    </div>
  );
}