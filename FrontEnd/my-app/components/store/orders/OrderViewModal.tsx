'use client';

import { Info, X } from 'lucide-react';

interface Props {
    open: boolean;
    order: any;
    onClose: () => void;
}
function InfoItem({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    );
}
export default function OrderViewModal({
    open,
    order,
    onClose,
}: Props) {
    if (!open || !order) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 text-gray-800">
            <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden">
                <div className="flex justify-between items-center border-b p-6">
                    <h2 className="text-xl font-bold">
                        Chi Tiết Đơn Hàng
                    </h2>

                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <InfoItem
                            label="Mã đơn"
                            value={order.id}
                        />

                        <InfoItem
                            label="Khách hàng"
                            value={order.customer}
                        />

                        <InfoItem
                            label="Tổng tiền"
                            value={`₫${order.amount.toLocaleString(
                                'vi-VN'
                            )}`}
                        />

                        <InfoItem
                            label="Ngày đặt"
                            value={order.date}
                        />
                    </div>

                    <div className="mt-8">
                        <h3 className="font-semibold mb-3">
                            Sản phẩm
                        </h3>

                        <div className="border rounded-xl overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-3 text-left">
                                            Sản phẩm
                                        </th>

                                        <th className="p-3">
                                            SL
                                        </th>

                                        <th className="p-3">
                                            Giá
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td className="p-3">
                                            Cà Chua Sấy
                                        </td>

                                        <td className="p-3 text-center">
                                            2
                                        </td>

                                        <td className="p-3 text-center">
                                            ₫240.000
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="font-semibold mb-2">
                            Địa chỉ giao hàng
                        </h3>

                        <p className="text-gray-600">
                            123 Nguyễn Văn Cừ, Quận 5,
                            TP.HCM
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}