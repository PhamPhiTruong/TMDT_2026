'use client';

import { Search, Bell, User } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng, sản phẩm..."
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                py-2.5
                pl-10
                pr-4
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-green-100
                focus:border-green-600
                transition
              "
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          <button
            className="
              relative
              p-2
              rounded-xl
              hover:bg-gray-100
              transition
            "
          >
            <Bell
              size={20}
              className="text-[var(--color-primary)]"
            />

            <span
              className="
                absolute
                top-1
                right-1
                h-2
                w-2
                rounded-full
                bg-red-500
              "
            />
          </button>

          <div className="flex items-center gap-3">
            <div
              className="
                h-10
                w-10
                rounded-full
                flex
                items-center
                justify-center
              "
              style={{
                backgroundColor:
                  'var(--color-primary-light)',
              }}
            >
              <User
                size={18}
                className="text-white"
              />
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-900">
                Store Owner
              </p>

              <p className="text-xs text-gray-500">
                NongLam Store
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}