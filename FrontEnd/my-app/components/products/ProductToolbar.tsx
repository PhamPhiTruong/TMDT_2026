"use client";

export default function ProductToolbar() {
    return (
        <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="border rounded px-2 py-1"
                />
                <select className="border rounded px-2 py-1">
                    <option value="">Tất cả trạng thái</option>
                    <option value="ACTIVE">Đang bán</option>
                    <option value="INACTIVE">Ngừng bán</option>
                </select>
            </div>
            <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                + Thêm sản phẩm
            </button>
        </div>
    );
}