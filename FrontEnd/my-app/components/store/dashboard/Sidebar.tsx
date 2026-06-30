'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Ticket,
  LogOut,
  Store,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      href: '/store',
    },
    {
      name: 'Đơn Hàng',
      icon: ShoppingCart,
      href: '/store/orders',
    },
    {
      name: 'Sản Phẩm',
      icon: Package,
      href: '/store/products',
    },
    {
      name: 'Voucher',
      icon: Ticket,
      href: '/store/vouchers',
    },
  ];

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-40
        flex
        h-screen
        w-64
        flex-col
        border-r
        border-gray-200
        bg-white
      "
    >
      {/* Logo */}
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
            "
            style={{
              backgroundColor:
                'var(--color-primary)',
            }}
          >
            <Store
              size={22}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="font-bold text-gray-900">
              Admin Panel
            </h1>

            <p className="text-sm text-gray-500">
              NongLam Store
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const active =
              pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  transition-all
                  ${active
                    ? `
                        bg-green-50
                        text-[var(--color-primary)]
                        font-semibold
                      `
                    : `
                        text-gray-700
                        hover:bg-gray-100
                      `
                  }
                `}
              >
                <item.icon size={20} />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 p-4">
        <button
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-4
            py-3
            text-red-600
            transition
            hover:bg-red-50
          "
        >
          <LogOut size={20} />

          <span>Đăng Xuất</span>
        </button>
      </div>
    </aside>
  );
}