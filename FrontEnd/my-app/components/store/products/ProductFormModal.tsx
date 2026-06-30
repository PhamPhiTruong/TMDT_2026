'use client';

import { X } from 'lucide-react';

interface Props {
    open: boolean;
    mode: 'create' | 'edit';
    product?: any;
    onClose: () => void;
}
export default function ProductFormModal({
    open,
    mode,
    product,
    onClose,
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 text-gray-800">
            <div className="bg-white rounded-3xl w-full max-w-2xl">
                <div className="flex justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">
                        {mode === 'create'
                            ? 'Thêm Sản Phẩm'
                            : 'Chỉnh Sửa Sản Phẩm'}
                    </h2>

                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <input
                        defaultValue={product?.name}
                        placeholder="Tên sản phẩm"
                        className="w-full border rounded-xl p-3"
                    />

                    <input
                        defaultValue={product?.price}
                        placeholder="Giá"
                        className="w-full border rounded-xl p-3"
                    />

                    <input
                        defaultValue={product?.stock}
                        placeholder="Tồn kho"
                        className="w-full border rounded-xl p-3"
                    />

                    <textarea
                        rows={5}
                        placeholder="Mô tả sản phẩm"
                        className="w-full border rounded-xl p-3"
                    />

                    <div>
                        <label className="font-medium">
                            Upload ảnh
                        </label>

                        <input
                            type="file"
                            multiple
                            className="mt-2"
                        />
                    </div>

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
                        {mode === 'create'
                            ? 'Tạo sản phẩm'
                            : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
}