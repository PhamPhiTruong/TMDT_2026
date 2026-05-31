'use client';

import { X } from 'lucide-react';

export default function VoucherFormModal({
    open,
    onClose,
    mode = 'create',
}: {
    open: boolean;
    onClose: () => void;
    mode?: 'create' | 'edit';
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center text-gray-800">
            <div className="w-full max-w-4xl rounded-2xl bg-white p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">
                        {mode === 'create'
                            ? 'Tạo Voucher'
                            : 'Cập Nhật Voucher'}
                    </h2>

                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <input
                        placeholder="Tên voucher"
                        className="input"
                    />

                    <input
                        placeholder="Code"
                        className="input"
                    />

                    <select className="input">
                        <option value="percent">
                            Phần Trăm
                        </option>
                        <option value="fixed">
                            Tiền Mặt
                        </option>
                    </select>

                    <input
                        type="number"
                        placeholder="Giá trị giảm"
                        className="input"
                    />

                    <input
                        type="number"
                        placeholder="Giảm tối đa"
                        className="input"
                    />

                    <input
                        type="number"
                        placeholder="Đơn tối thiểu"
                        className="input"
                    />

                    <input
                        type="number"
                        placeholder="Giới hạn sử dụng"
                        className="input"
                    />

                    <select className="input">
                        <option value="active">
                            Hoạt động
                        </option>

                        <option value="inactive">
                            Tạm dừng
                        </option>
                    </select>

                    <input
                        type="date"
                        className="input"
                    />

                    <input
                        type="date"
                        className="input"
                    />
                </div>

                <textarea
                    rows={4}
                    placeholder="Mô tả"
                    className="input mt-4 w-full"
                />

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Hủy
                    </button>

                    <button
                        className="px-4 py-2 rounded-lg text-white"
                        style={{
                            backgroundColor:
                                'var(--color-primary)',
                        }}
                    >
                        {mode === 'create'
                            ? 'Tạo Voucher'
                            : 'Cập Nhật'}
                    </button>
                </div>
            </div>
        </div>
    );
}