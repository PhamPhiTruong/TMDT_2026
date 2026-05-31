'use client';

import { AlertTriangle } from 'lucide-react';

export default function DeleteVoucherModal({
    open,
    onClose,
    onDelete,
    voucherName,
}: {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    voucherName: string;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center text-gray-800">
            <div className="w-full max-w-md rounded-2xl bg-white p-6">
                <div className="flex flex-col items-center">
                    <AlertTriangle className="text-red-500 w-14 h-14" />

                    <h2 className="mt-4 text-xl font-bold">
                        Xóa Voucher
                    </h2>

                    <p className="mt-2 text-center text-gray-600">
                        Bạn có chắc muốn xóa voucher
                        <strong>
                            {' '}
                            {voucherName}
                        </strong>
                        ?
                    </p>

                    <p className="text-sm text-red-500 mt-1">
                        Hành động này không thể hoàn tác.
                    </p>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 border rounded-lg py-2"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={onDelete}
                        className="flex-1 rounded-lg py-2 bg-red-600 text-white"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}