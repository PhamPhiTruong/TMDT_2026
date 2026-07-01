"use client";

import { useState } from "react";
import { useProducts, usePublishProducts } from "@/hooks/useProducts";

export default function PublishDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { data, isLoading } = useProducts();
    const mutation = usePublishProducts();
    const [selected, setSelected] = useState<number[]>([]);
    const [toast, setToast] = useState<string | null>(null);

    const handleToggle = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handlePublish = () => {
        if (selected.length === 0) {
            setToast("Chọn ít nhất 1 sản phẩm");
            return;
        }
        mutation.mutate(selected, {
            onSuccess: () => {
                setToast("Đã publish sản phẩm");
                setSelected([]);
                onClose();
            },
            onError: (e: any) => {
                setToast(e?.message || "Lỗi publish");
            }
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow p-6 min-w-[320px] max-w-[90vw]">
                <h2 className="text-lg font-bold mb-4">Chọn sản phẩm để publish</h2>
                {isLoading ? (
                    <div>Đang tải...</div>
                ) : (
                    <div className="max-h-64 overflow-y-auto mb-4">
                        {data && data.length > 0 ? (
                            data.map((p) => (
                                <label key={p.productId} className="flex items-center gap-2 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(p.productId)}
                                        onChange={() => handleToggle(p.productId)}
                                    />
                                    <span>{p.name}</span>
                                </label>
                            ))
                        ) : (
                            <div>Không có sản phẩm</div>
                        )}
                    </div>
                )}
                <div className="flex gap-2 justify-end">
                    <button
                        className="px-3 py-1 rounded bg-gray-200"
                        onClick={onClose}
                        disabled={mutation.status === "pending"}
                    >
                        Đóng
                    </button>
                    <button
                        className="px-3 py-1 rounded bg-green-600 text-white"
                        onClick={handlePublish}
                        disabled={mutation.status === "pending"}
                    >
                        {mutation.status === "pending" ? "Đang publish..." : "Publish"}
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