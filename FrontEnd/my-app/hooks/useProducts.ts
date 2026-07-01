import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import { Product } from "@/types/product";

export function useProducts() {
    const query = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await ProductService.getAll();
            return res.data.data as Product[];
        }
    });
    return {
        ...query,
        data: query.data as Product[] | undefined
    };
}

export function useProduct(id: number) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const res = await ProductService.getOne(id);
            return res.data.data as Product;
        },
        enabled: !!id
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ProductService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }: { id: number; body: any }) =>
            ProductService.update(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => ProductService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });
}

export function usePublishProducts() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productIds: number[]) => ProductService.publish(productIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["published-products"] });
        }
    });
}