import api from "@/lib/axios";
import { Product } from "@/types/product";
import { ApiResponse } from "@/types/ApiResponse";

export const ProductService = {
    getAll: () =>
        api.get<ApiResponse<Product[]>>("/store/products"),

    getOne: (id: number) =>
        api.get<ApiResponse<Product>>(`/store/products/${id}`),

    create: (body: any) =>
        api.post<ApiResponse<any>>("/store/products", body),

    update: (id: number, body: any) =>
        api.put<ApiResponse<any>>(`/store/products/${id}`, body),

    delete: (id: number) =>
        api.delete<ApiResponse<any>>(`/store/products/${id}`),

    publish: (productIds: number[]) =>
        api.put<ApiResponse<any>>("/store/products/on_store", {
            productIds
        }),

    getPublished: () =>
        api.get<ApiResponse<Product[]>>("/store/products/on_store")
};
