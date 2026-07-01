"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    Store,
    Package,
    Image,
    TicketPercent,
    ShoppingCart,
    ChartColumn,
    Settings,
} from "lucide-react";

import SidebarItem from "./SidebarItem";

const menus = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Store",
        href: "/store",
        icon: Store,
    },
    {
        title: "Products",
        href: "/dashboard/products",
        icon: Package,
    },
    {
        title: "Banners",
        href: "/banners",
        icon: Image,
    },
    {
        title: "Vouchers",
        href: "/dashboard/coupons",
        icon: TicketPercent,
    },
    {
        title: "Orders",
        href: "/orders",
        icon: ShoppingCart,
    },
    {
        title: "Revenue",
        href: "/revenue",
        icon: ChartColumn,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r bg-white">
            <div className="border-b p-6">
                <h1 className="text-xl font-bold text-green-600">
                    DryFood Seller
                </h1>
            </div>

            <nav className="space-y-1 p-3">
                {menus.map((item) => (
                    <SidebarItem
                        key={item.href}
                        item={item}
                        active={pathname === item.href}
                    />
                ))}
            </nav>
        </aside>
    );
}