'use client';

import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const dailyData = [
  { name: 'Thứ 2', revenue: 4000, orders: 24 },
  { name: 'Thứ 3', revenue: 3000, orders: 13 },
  { name: 'Thứ 4', revenue: 2000, orders: 9 },
  { name: 'Thứ 5', revenue: 2780, orders: 39 },
  { name: 'Thứ 6', revenue: 1890, orders: 22 },
  { name: 'Thứ 7', revenue: 2390, orders: 28 },
  { name: 'CN', revenue: 3490, orders: 20 },
];

const weeklyData = [
  { name: 'Tuần 1', revenue: 24000, orders: 120 },
  { name: 'Tuần 2', revenue: 28000, orders: 140 },
  { name: 'Tuần 3', revenue: 21000, orders: 110 },
  { name: 'Tuần 4', revenue: 32000, orders: 160 },
];

const monthlyData = [
  { name: 'Tháng 1', revenue: 98000, orders: 520 },
  { name: 'Tháng 2', revenue: 115000, orders: 580 },
  { name: 'Tháng 3', revenue: 125000, orders: 650 },
  { name: 'Tháng 4', revenue: 108000, orders: 610 },
  { name: 'Tháng 5', revenue: 142000, orders: 720 },
];

type TimeRange = 'day' | 'week' | 'month';

export default function RevenueAnalytics() {
  const [timeRange, setTimeRange] =
    useState<TimeRange>('month');

  const chartData = useMemo(() => {
    switch (timeRange) {
      case 'day':
        return dailyData;
      case 'week':
        return weeklyData;
      case 'month':
        return monthlyData;
      default:
        return monthlyData;
    }
  }, [timeRange]);

  const totalRevenue = chartData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  const totalOrders = chartData.reduce(
    (sum, item) => sum + item.orders,
    0
  );

  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Thống Kê Doanh Thu
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Theo dõi doanh thu và đơn hàng theo thời gian
          </p>
        </div>

        <div className="flex gap-2">
          {(['day', 'week', 'month'] as const).map(
            (range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  rounded-xl
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition
                  ${timeRange === range
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {range === 'day'
                  ? 'Ngày'
                  : range === 'week'
                    ? 'Tuần'
                    : 'Tháng'}
              </button>
            )
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-sm text-gray-500">
            Tổng Doanh Thu
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            ₫{totalRevenue.toLocaleString('vi-VN')}
          </p>
        </div>

        <div className="rounded-xl bg-orange-50 p-4">
          <p className="text-sm text-gray-500">
            Tổng Đơn Hàng
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {totalOrders.toLocaleString('vi-VN')}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={chartData}>
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
            yAxisId="revenue"
            tick={{ fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            yAxisId="orders"
            orientation="right"
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
            formatter={(value, name) => {
              if (name === 'Doanh Thu') {
                return [
                  `₫${Number(value).toLocaleString(
                    'vi-VN'
                  )}`,
                  name,
                ];
              }

              return [
                `${value} đơn`,
                name,
              ];
            }}
          />

          <Legend />

          <Line
            yAxisId="revenue"
            type="monotone"
            dataKey="revenue"
            name="Doanh Thu"
            stroke="#2e7d32"
            strokeWidth={3}
            dot={{
              fill: '#2e7d32',
              r: 5,
            }}
            activeDot={{ r: 7 }}
          />

          <Line
            yAxisId="orders"
            type="monotone"
            dataKey="orders"
            name="Số Đơn Hàng"
            stroke="#f97316"
            strokeWidth={3}
            dot={{
              fill: '#f97316',
              r: 5,
            }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}