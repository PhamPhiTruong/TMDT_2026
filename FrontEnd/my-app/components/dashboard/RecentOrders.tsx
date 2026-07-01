"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";

const STATUS_STYLES: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-red-100 text-red-700",
};

function fmtVND(v: number) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
}

export default function RecentOrders() {
    const { data } = useDashboard();

    const orders = data?.recentOrders ?? [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Đơn hàng gần đây</CardTitle>
            </CardHeader>
            <CardContent>
                {orders.length === 0 ? (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-slate-400">
                        Chưa có đơn hàng
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order: { orderId: number; customerName: string; totalAmount: number; status: string; createdAt: string }) => (
                            <div key={order.orderId} className="flex items-center justify-between rounded-lg border p-3">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">#{order.orderId}</span>
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status] ?? "bg-slate-100 text-slate-700"}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 truncate text-sm text-slate-500">
                                        {order.customerName}
                                    </p>
                                </div>
                                <div className="ml-4 shrink-0 text-right">
                                    <p className="text-sm font-semibold">{fmtVND(order.totalAmount)}</p>
                                    <p className="text-xs text-slate-400">
                                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}