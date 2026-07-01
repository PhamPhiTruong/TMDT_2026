"use client";

import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function ProductTable() {
    const { data, isLoading, isError } = useProducts();

    if (isLoading) {
        return <div className="p-4">Đang tải...</div>;
    }

    if (isError) {
        return <div className="p-4 text-red-500">Không tải được dữ liệu.</div>;
    }

    if (!data || data.length === 0) {
        return <div className="p-4 text-gray-500">Chưa có sản phẩm.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Ảnh</th>
                        <th className="p-2 border">Tên</th>
                        <th className="p-2 border">Giá</th>
                        <th className="p-2 border">Tồn kho</th>
                        <th className="p-2 border">Trạng thái</th>
                        <th className="p-2 border">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((product: Product) => (
                        <tr key={product.productId} className="border-b">
                            <td className="p-2 border">
                                {product.images?.[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        width={48}
                                        height={48}
                                        className="object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded" />
                                )}
                            </td>
                            <td className="p-2 border">{product.name}</td>
                            <td className="p-2 border">{product.price.toLocaleString()}₫</td>
                            <td className="p-2 border">{product.quantity}</td>
                            <td className="p-2 border">
                                <Badge variant={product.status === "ACTIVE" ? "default" : "secondary"}>
                                    {product.status}
                                </Badge>
                            </td>
                            <td className="p-2 border">
                                <button className="text-blue-600 hover:underline mr-2">Sửa</button>
                                <button className="text-red-600 hover:underline mr-2">Xóa</button>
                                <button className="text-green-600 hover:underline">Publish</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
