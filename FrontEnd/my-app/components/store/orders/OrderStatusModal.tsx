'use client';

import { X } from 'lucide-react';

interface Props {
    open: boolean;
    order: any;
    onClose: () => void;
}
export default function OrderStatusModal({
    open,
    order,
    onClose,
}: Props) {
    if (!open || !order) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 text-gray-800">
            <div className="bg-white rounded-3xl w-full max-w-lg">
                <div className="flex justify-between p-6 border-b">
                    <h2 className="font-bold text-xl">
                        Cập Nhật Trạng Thái
                    </h2>

                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="p-6">
                    <p className="mb-3 text-gray-600">
                        Đơn hàng:
                        <strong> {order.id}</strong>
                    </p>

                    <select className="w-full border rounded-xl p-3">
                        <option>
                            Chờ xác nhận
                        </option>

                        <option>
                            Đang xử lý
                        </option>

                        <option>
                            Đang giao
                        </option>

                        <option>
                            Đã giao
                        </option>

                        <option>
                            Đã hủy
                        </option>
                    </select>

                    <textarea
                        rows={4}
                        placeholder="Ghi chú"
                        className="w-full border rounded-xl p-3 mt-4"
                    />

                    <button
                        className="
              w-full
              mt-4
              py-3
              rounded-xl
              text-white
            "
                        style={{
                            backgroundColor:
                                'var(--color-primary)',
                        }}
                    >
                        Lưu Thay Đổi
                    </button>
                </div>
            </div>
        </div>
    );
}