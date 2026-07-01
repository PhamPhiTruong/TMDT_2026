import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const res = await DashboardService.getStats();
            return res.data;
        },
    });
}

export function useDailyRevenue(days = 7) {
    return useQuery({
        queryKey: ["daily-revenue", days],
        queryFn: async () => {
            const res = await DashboardService.getDailyRevenue(days);
            return res.data;
        },
    });
}

export function useRecentOrders(limit = 5) {
    return useQuery({
        queryKey: ["recent-orders", limit],
        queryFn: async () => {
            const res = await DashboardService.getRecentOrders(limit);
            return res.data;
        },
    });
}

/** Combined hook for dashboard page */
export function useDashboard() {
    const stats = useDashboardStats();
    const revenue = useDailyRevenue();
    const recentOrders = useRecentOrders();

    return {
        data: {
            ...stats.data,
            dailyRevenue: revenue.data,
            recentOrders: recentOrders.data,
        },
        isLoading: stats.isLoading || revenue.isLoading || recentOrders.isLoading,
    };
}
