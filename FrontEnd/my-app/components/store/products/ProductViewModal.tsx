'use client';

import Image from 'next/image';
import { X } from 'lucide-react';

interface Props {
    open: boolean;
    product: any;
    onClose: () => void;
}

export default function ProductViewModal({
    open,
    product,
    onClose,
}: Props) {
    if (!open || !product) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 text-gray-800">
            <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">
                        Chi Tiết Sản Phẩm
                    </h2>

                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="p-6">
                    <Image
                        src={product.thumbnail}
                        alt={product.name}
                        width={500}
                        height={300}
                        className="w-full h-72 rounded-2xl object-cover"
                    />

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <Info label="Tên" value={product.name} />
                        <Info label="Mã" value={product.id} />
                        <Info label="Danh mục" value={product.category} />
                        <Info
                            label="Giá"
                            value={`₫${product.price.toLocaleString('vi-VN')}`}
                        />
                        <Info label="Tồn kho" value={product.stock} />
                        <Info label="Đã bán" value={product.sales} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Info({
    label,
    value,
}: {
    label: string;
    value: any;
}) {
    return (
        <div>
            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="font-semibold">
                {value}
            </p>
        </div>
    );
}