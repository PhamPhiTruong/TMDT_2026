'use client';

interface Props {
    open: boolean;
    order: any;
    onClose: () => void;
    onConfirm: () => void;
}
export default function DeleteOrderModal({
    open,
    order,
    onClose,
    onConfirm,
}: Props) {
    if (!open || !order) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 text-gray-800">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold">
                    Hủy Đơn Hàng
                </h2>

                <p className="mt-3 text-gray-600">
                    Bạn có chắc muốn hủy đơn
                    <strong> {order.id}</strong> ?
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
                        Xác Nhận
                    </button>
                </div>
            </div>
        </div>
    );
}