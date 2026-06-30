import KPICards from '@/components/store/dashboard/KPICards';
import RevenueAnalytics from '@/components/store/dashboard/RevenueAnalytics';
import OrderStatusPie from '@/components/store/dashboard/OrderStatusPie';
import ProductOverview from '@/components/store/dashboard/ProductOverview';
import VoucherOverview from '@/components/store/dashboard/VoucherOverview';
import QuickActions from '@/components/store/dashboard/QuickActions';
import RecentOrders from '@/components/store/dashboard/RecentOrders';
export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Theo dõi doanh thu và hoạt động cửa hàng
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">
            Hôm nay
          </p>

          <p className="font-semibold text-gray-900">
            {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>

      {/* KPI */}
      <KPICards />

      {/* Revenue */}
      <RevenueAnalytics />

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <OrderStatusPie />
        <ProductOverview />
      </div>

      {/* Voucher + Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <VoucherOverview />
        <QuickActions />
      </div>

      {/* Orders */}
      <RecentOrders />
    </div>
  );
}