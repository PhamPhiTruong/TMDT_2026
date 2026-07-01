"use client";

import { useDeleteProduct } from "@/hooks/useProducts";
import { useState } from "react";

export default function DeleteDialog({
    open,
    onClose,
    productId,
    productName
}: {
    open: boolean;
    onClose: () => void;
    productId: number | null;
    productName?: string;
}) {
    const mutation = useDeleteProduct();
    const [toast, setToast] = useState<string | null>(null);

    const handleDelete = () => {
        if (!productId) return;
        mutation.mutate(productId, {
            onSuccess: () => {
                setToast("Đã xóa sản phẩm");
                onClose();
            },
            onError: (e: any) => {
                setToast(e?.message || "Lỗi xóa sản phẩm");
            }
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow p-6 min-w-[320px] max-w-[90vw]">
                <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
                <div className="mb-4">
                    Bạn có chắc muốn xóa sản phẩm
                    <span className="font-semibold"> {productName || ""} </span>
                    không?
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        className="px-3 py-1 rounded bg-gray-200"
                        onClick={onClose}
                        disabled={mutation.status === "pending"}
                    >
                        Hủy
                    </button>
                    <button
                        className="px-3 py-1 rounded bg-red-600 text-white"
                        onClick={handleDelete}
                        disabled={mutation.status === "pending"}
                    >
                        {mutation.status === "pending" ? "Đang xóa..." : "Xóa"}
                    </button>
                </div>
                {toast && (
                    <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow">
                        {toast}
                        <button className="ml-2" onClick={() => setToast(null)}>x</button>
                    </div>
                )}
            </div>
        </div>
    );
}