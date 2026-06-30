'use client';

import { Voucher } from '@/app/store/vouchers/page';
import { X } from 'lucide-react';


interface Props {
    voucher: Voucher | null;
    open: boolean;
    onClose: () => void;
}

const Info = ({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">
            {value}
        </p>
    </div>
);

export default function VoucherDetailModal({
    voucher,
    open,
    onClose,
}: Props) {
    if (!open || !voucher) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center text-gray-800">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">
                        Chi Tiết Voucher
                    </h2>

                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <Info
                        label="Mã Voucher"
                        value={voucher.id}
                    />

                    <Info
                        label="Code"
                        value={voucher.code}
                    />

                    <Info
                        label="Tên Voucher"
                        value={voucher.name}
                    />

                    <Info
                        label="Trạng Thái"
                        value={voucher.status}
                    />

                    <Info
                        label="Loại Giảm"
                        value={
                            voucher.discountType === 'percent'
                                ? 'Phần Trăm'
                                : 'Tiền Mặt'
                        }
                    />

                    <Info
                        label="Giá Trị Giảm"
                        value={
                            voucher.discountType === 'percent'
                                ? `${voucher.discountValue}%`
                                : `₫${voucher.discountValue.toLocaleString(
                                    'vi-VN'
                                )}`
                        }
                    />

                    <Info
                        label="Đơn Tối Thiểu"
                        value={`₫${voucher.minOrderValue.toLocaleString(
                            'vi-VN'
                        )}`}
                    />

                    <Info
                        label="Giảm Tối Đa"
                        value={
                            voucher.maxDiscount
                                ? `₫${voucher.maxDiscount.toLocaleString(
                                    'vi-VN'
                                )}`
                                : '-'
                        }
                    />

                    <Info
                        label="Đã Dùng"
                        value={`${voucher.usage}/${voucher.limit}`}
                    />

                    <Info
                        label="Ngày Tạo"
                        value={voucher.createdAt}
                    />

                    <Info
                        label="Bắt Đầu"
                        value={voucher.startDate}
                    />

                    <Info
                        label="Kết Thúc"
                        value={voucher.endDate}
                    />
                </div>

                <div className="mt-5">
                    <p className="text-sm text-gray-500">
                        Mô Tả
                    </p>

                    <p className="mt-1 text-gray-700">
                        {voucher.description}
                    </p>
                </div>
            </div>
        </div>
    );
}