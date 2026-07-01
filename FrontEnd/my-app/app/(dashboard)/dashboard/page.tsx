import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentOrders from "@/components/dashboard/RecentOrders";
import RevenueChart from "@/components/dashboard/RevenueChart";

export default function DashboardPage() {
    return (
        <div className="space-y-6">

            <DashboardStats />

            <div className="grid gap-6 lg:grid-cols-3">

                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>

                <RecentOrders />

            </div>

        </div>
    );
}