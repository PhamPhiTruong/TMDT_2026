'use client';

import { X } from 'lucide-react';

interface Props {
    open: boolean;
    onClose: () => void;
}
export default function CreateOrderModal({
    open,
    onClose,
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 text-gray-800">
            <div className="bg-white rounded-3xl w-full max-w-2xl">
                <div className="flex justify-between border-b p-6">
                    <h2 className="font-bold text-xl">
                        Tạo Đơn Hàng
                    </h2>

                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <input
                        placeholder="Tên khách hàng"
                        className="w-full border rounded-xl p-3"
                    />

                    <input
                        placeholder="Số điện thoại"
                        className="w-full border rounded-xl p-3"
                    />

                    <textarea
                        rows={4}
                        placeholder="Địa chỉ"
                        className="w-full border rounded-xl p-3"
                    />

                    <button
                        className="
              w-full
              py-3
              rounded-xl
              text-white
            "
                        style={{
                            backgroundColor:
                                'var(--color-primary)',
                        }}
                    >
                        Tạo Đơn Hàng
                    </button>
                </div>
            </div>
        </div>
    );
}