'use client';

import Image from 'next/image';
import { X, Trash2 } from 'lucide-react';

interface Props {
    open: boolean;
    product: any;
    onClose: () => void;
}
export default function ProductImagesModal({
    open,
    product,
    onClose,
}: Props) {
    if (!open || !product) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 text-gray-800">
            <div className="bg-white rounded-3xl w-full max-w-4xl">
                <div className="flex justify-between p-6 border-b">
                    <h2 className="font-bold text-xl">
                        Quản Lý Hình Ảnh
                    </h2>

                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="p-6">
                    <input
                        type="file"
                        multiple
                        className="mb-6"
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {product.images.map(
                            (img: string, index: number) => (
                                <div
                                    key={index}
                                    className="relative"
                                >
                                    <Image
                                        src={img}
                                        alt=""
                                        width={200}
                                        height={200}
                                        className="
                      h-40
                      w-full
                      rounded-xl
                      object-cover
                    "
                                    />

                                    <button
                                        className="
                      absolute
                      top-2
                      right-2
                      bg-red-500
                      text-white
                      p-2
                      rounded-full
                    "
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}