import api from "@/lib/axios";

export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalVouchers: number;
}

export interface DailyRevenue {
    date: string;
    revenue: number;
    orderCount: number;
}

export interface RecentOrder {
    orderId: number;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

export const DashboardService = {
    getStats: () => api.get<DashboardStats>("/dashboard/stats"),

    getDailyRevenue: (days = 7) =>
        api.get<DailyRevenue[]>("/dashboard/revenue/daily", { params: { days } }),

    getRecentOrders: (limit = 5) =>
        api.get<RecentOrder[]>("/dashboard/recent-orders", { params: { limit } }),
};