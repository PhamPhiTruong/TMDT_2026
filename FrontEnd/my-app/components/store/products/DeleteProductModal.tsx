'use client';

import { AlertTriangle } from "lucide-react";

interface Props {
    open: boolean;
    product: any;
    onClose: () => void;
    onConfirm: () => void;
}
export default function DeleteProductModal({
    open,
    product,
    onClose,
    onConfirm,
}: Props) {
    if (!open || !product) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 text-gray-800">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full">
                <AlertTriangle className="text-red-500 w-14 h-14" />
                <h2 className="text-xl font-bold">
                    Xóa sản phẩm
                </h2>

                <p className="mt-3 text-gray-600">
                    Bạn có chắc muốn xóa
                    <strong> {product.name}</strong> ?
                </p>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="
              flex-1
              border
              rounded-xl
              py-3
            "
                    >
                        Hủy
                    </button>

                    <button
                        onClick={onConfirm}
                        className="
              flex-1
              bg-red-500
              text-white
              rounded-xl
              py-3
            "
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}