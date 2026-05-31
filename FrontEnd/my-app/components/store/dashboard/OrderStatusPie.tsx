'use client';

import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const orderStatusData = [
  {
    name: 'Chờ Xác Nhận',
    value: 45,
    color: '#f97316',
  },
  {
    name: 'Đang Xử Lý',
    value: 60,
    color: '#3b82f6',
  },
  {
    name: 'Đang Giao',
    value: 35,
    color: '#8b5cf6',
  },
  {
    name: 'Đã Giao',
    value: 150,
    color: '#2e7d32',
  },
  {
    name: 'Hủy',
    value: 12,
    color: '#dc2626',
  },
];

export default function OrderStatusPie() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Trạng Thái Đơn Hàng</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={orderStatusData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {orderStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => `${value} đơn hàng`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {orderStatusData.map((status, index) => (
          <div key={index} className="text-center">
            <div
              className="h-3 w-full rounded mb-2"
              style={{ backgroundColor: status.color }}
            ></div>
            <p className="text-sm text-gray-600">{status.name}</p>
            <p className="font-bold text-gray-900">{status.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
