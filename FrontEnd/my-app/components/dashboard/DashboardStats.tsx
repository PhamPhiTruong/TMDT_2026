import {
    ShoppingCart,
    DollarSign,
    Package,
    Ticket,
} from "lucide-react";

import StatCard from "./StatCard";

export default function DashboardStats() {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
                title="Doanh thu"
                value="35.600.000đ"
                icon={<DollarSign />}
            />

            <StatCard
                title="Đơn hàng"
                value="186"
                icon={<ShoppingCart />}
            />

            <StatCard
                title="Sản phẩm"
                value="42"
                icon={<Package />}
            />

            <StatCard
                title="Voucher"
                value="8"
                icon={<Ticket />}
            />

        </div>
    );
}