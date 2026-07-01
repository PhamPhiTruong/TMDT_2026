import ProductForm from "@/components/products/ProductForm";

export default function CreateProductPage() {
    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Thêm sản phẩm mới</h1>
            <ProductForm />
        </div>
    );
}