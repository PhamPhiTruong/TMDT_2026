"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useDashboard } from "@/hooks/useDashboard";

function fmtDate(iso: string) {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function fmtVND(v: number) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
}

interface ChartPoint {
    date: string;
    revenue: number;
    orders: number;
}

export default function RevenueChart() {
    const { data } = useDashboard();

    const chartData: ChartPoint[] =
        data?.dailyRevenue?.map((d: { date: string; revenue: number; orderCount?: number }) => ({
            date: fmtDate(d.date),
            revenue: d.revenue,
            orders: d.orderCount ?? 0,
        })) ?? [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Doanh thu 7 ngày gần nhất</CardTitle>
            </CardHeader>
            <CardContent>
                {chartData.length === 0 ? (
                    <div className="flex h-80 items-center justify-center rounded-lg border border-dashed text-slate-400">
                        Chưa có dữ liệu
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                            <XAxis dataKey="date" className="text-xs" />
                            <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                                formatter={(value, name) => [
                                    name === "revenue" ? fmtVND(Number(value)) : String(value ?? ""),
                                    name === "revenue" ? "Doanh thu" : "Đơn hàng",
                                ]}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={2}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}