"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProduct } from "@/hooks/useProducts";
import { useState } from "react";

const schema = z.object({
    name: z.string().min(1, "Tên sản phẩm bắt buộc"),
    description: z.string().optional(),
    price: z.number().min(0, "Giá phải >= 0"),
    quantity: z.number().min(0, "Tồn kho phải >= 0"),
    images: z.array(z.string().url("URL ảnh không hợp lệ")).min(1, "Cần ít nhất 1 ảnh")
});

type FormValues = z.infer<typeof schema>;

export default function ProductForm() {
    const mutation = useCreateProduct();
    const [toast, setToast] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            quantity: 0,
            images: [""]
        }
    });

    const { fields, append, remove } = useFieldArray<FormValues>({
        control: form.control,
        name: "images"
    });

    const onSubmit = (values: FormValues) => {
        console.log("Submit form values:", values);
        mutation.mutate(values, {
            onSuccess: (data) => {
                console.log("API tạo sản phẩm thành công:", data);
                setToast("Đã tạo sản phẩm");
                form.reset();
            },
            onError: (e: any) => {
                console.log("API tạo sản phẩm lỗi:", e);
                setToast(e?.message || "Lỗi tạo sản phẩm");
            }
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto">
            <div>
                <label className="block mb-1">Tên sản phẩm</label>
                <input
                    {...form.register("name")}
                    className="border rounded px-2 py-1 w-full"
                />
                {form.formState.errors.name && (
                    <div className="text-red-500 text-sm">{form.formState.errors.name.message}</div>
                )}
            </div>
            <div>
                <label className="block mb-1">Mô tả</label>
                <textarea
                    {...form.register("description")}
                    className="border rounded px-2 py-1 w-full"
                />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block mb-1">Giá</label>
                    <input
                        type="number"
                        {...form.register("price", { valueAsNumber: true })}
                        className="border rounded px-2 py-1 w-full"
                    />
                    {form.formState.errors.price && (
                        <div className="text-red-500 text-sm">{form.formState.errors.price.message}</div>
                    )}
                </div>
                <div className="flex-1">
                    <label className="block mb-1">Tồn kho</label>
                    <input
                        type="number"
                        {...form.register("quantity", { valueAsNumber: true })}
                        className="border rounded px-2 py-1 w-full"
                    />
                    {form.formState.errors.quantity && (
                        <div className="text-red-500 text-sm">{form.formState.errors.quantity.message}</div>
                    )}
                </div>
            </div>
            <div>
                <label className="block mb-1">Ảnh sản phẩm</label>
                {fields.map((field, idx) => (
                    <div key={field.id} className="flex items-center gap-2 mb-2">
                        <input
                            {...form.register(`images.${idx}`)}
                            className="border rounded px-2 py-1 flex-1"
                            placeholder="URL ảnh"
                        />
                        <button
                            type="button"
                            className="text-red-500 px-2"
                            onClick={() => remove(idx)}
                            disabled={fields.length === 1}
                        >
                            Xóa
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => append("" as any)}
                >
                    + Thêm ảnh
                </button>
                {form.formState.errors.images && (
                    <div className="text-red-500 text-sm">{form.formState.errors.images.message as string}</div>
                )}
            </div>
            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={mutation.status === "pending"}
            >
                {mutation.status === "pending" ? "Đang lưu..." : "Lưu sản phẩm"}
            </button>
            {toast && (
                <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow">
                    {toast}
                    <button className="ml-2" onClick={() => setToast(null)}>x</button>
                </div>
            )}
        </form>
    );
}