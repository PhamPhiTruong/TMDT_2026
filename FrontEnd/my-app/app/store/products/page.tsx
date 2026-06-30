'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  ImageIcon,
} from 'lucide-react';
import DeleteProductModal from '@/components/store/products/DeleteProductModal';
import ProductFormModal from '@/components/store/products/ProductFormModal';
import ProductImagesModal from '@/components/store/products/ProductImagesModal';
import ProductViewModal from '@/components/store/products/ProductViewModal';

interface Product {
  id: string;
  name: string;
  thumbnail: string;
  images: string[];

  category: string;
  price: number;
  stock: number;
  sales: number;

  status: 'active' | 'draft' | 'out_of_stock';
  createdAt: string;
}

const products: Product[] = [
  {
    id: '#PRD002',
    name: 'Mận Sấy',
    thumbnail:
      'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400',

    images: [
      'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400',
      'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600',
    ],

    category: 'Trái Cây Sấy',
    price: 150000,
    stock: 80,
    sales: 180,

    status: 'active',
    createdAt: '2026-05-02',
  },

  {
    id: '#PRD003',
    name: 'Cam Sấy',
    thumbnail:
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400',

    images: [
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400',
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600',
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800',
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=1200',
    ],

    category: 'Trái Cây Sấy',
    price: 100000,
    stock: 200,
    sales: 290,

    status: 'active',
    createdAt: '2026-05-03',
  },

  {
    id: '#PRD004',
    name: 'Kiwi Sấy',
    thumbnail:
      'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=400',

    images: [
      'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=400',
    ],

    category: 'Trái Cây Sấy',
    price: 180000,
    stock: 60,
    sales: 150,

    status: 'draft',
    createdAt: '2026-05-05',
  },

  {
    id: '#PRD005',
    name: 'Dâu Sấy',
    thumbnail:
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',

    images: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600',
    ],

    category: 'Quả Mọng',
    price: 200000,
    stock: 45,
    sales: 220,

    status: 'out_of_stock',
    createdAt: '2026-05-06',
  },
];

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);


  const totalStock = products.reduce(
    (sum, item) => sum + item.stock,
    0
  );

  const totalSales = products.reduce(
    (sum, item) => sum + item.sales,
    0
  );

  const lowStock = products.filter(
    (item) => item.stock < 50
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản Lý Sản Phẩm
          </h1>

          <p className="mt-2 text-gray-500">
            Quản lý danh sách sản phẩm của cửa hàng
          </p>
        </div>

        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            px-5
            py-3
            text-white
            font-medium
            transition
            hover:opacity-90
          "
          style={{
            backgroundColor: 'var(--color-primary)',
          }}
        >
          <Plus size={18} />
          <span>Thêm Sản Phẩm</span>
        </button>
      </div>

      {/* KPI */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Tổng Sản Phẩm
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {products.length}
              </p>
            </div>

            <Package
              size={24}
              style={{
                color: 'var(--color-primary)',
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Tổng Tồn Kho
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalStock}
              </p>
            </div>

            <Package
              size={24}
              style={{
                color: 'var(--color-accent)',
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Đã Bán
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalSales}
              </p>
            </div>

            <TrendingUp
              size={24}
              className="text-green-600"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Sắp Hết Hàng
              </p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {lowStock}
              </p>
            </div>

            <AlertTriangle
              size={24}
              className="text-red-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {/* Search */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                py-3
                pl-10
                pr-4
                focus:outline-none
                focus:ring-2
                focus:ring-green-100
              "
            />
          </div>

          <select
            className="
              rounded-xl
              border
              border-gray-200
              px-4
              py-3
              text-gray-700
              focus:outline-none
            "
          >
            <option>Tất cả danh mục</option>
            <option>Trái cây sấy</option>
            <option>Rau củ sấy</option>
            <option>Hạt dinh dưỡng</option>
          </select>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Sản Phẩm
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Danh Mục
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Giá
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Tồn Kho
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                  Đã Bán
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-gray-600">
                  Hành Động
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="
                    border-b
                    border-gray-100
                    hover:bg-gray-50
                    transition
                  "
                >
                  {/* Product */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="
                          h-16
                          w-16
                          rounded-xl
                          object-cover
                          border
                          border-gray-200
                        "
                        />

                        <span
                          className="
                            absolute
                            -right-1
                            -top-1  
                            bg-black/70
                            text-white
                            text-[10px]
                            px-1.5
                            py-0.5
                            rounded-full
                          "
                        >
                          {product.images.length}
                        </span>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {product.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {product.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-gray-700">
                    {product.category}
                  </td>

                  <td className="px-4 py-4 font-semibold text-gray-900">
                    ₫{product.price.toLocaleString('vi-VN')}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${product.stock > 100
                        ? 'bg-green-100 text-green-700'
                        : product.stock > 50
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="px-4 py-4 font-medium text-gray-700">
                    {product.sales}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        title="Xem chi tiết"
                        className="
                          p-2
                          rounded-lg  
                          hover:bg-green-50
                          transition
                        "
                        onClick={() => {
                          setSelectedProduct(product);
                          setViewOpen(true);
                        }}
                      >
                        <Eye
                          size={18}
                          style={{
                            color: 'var(--color-primary)',
                          }}
                        />
                      </button>
                      <button
                        title="Quản lý ảnh"
                        className="
                          p-2
                          rounded-lg
                          hover:bg-blue-50
                          transition
                        "
                        onClick={() => {
                          setSelectedProduct(product);
                          setImageOpen(true);
                        }}
                      >
                        <ImageIcon
                          size={18}
                          className="text-blue-600"
                        />
                      </button>
                      <button
                        title="Chỉnh sửa"
                        className="
                          p-2
                          rounded-lg
                          hover:bg-orange-50
                          transition
                        "
                        onClick={() => {
                          setSelectedProduct(product);
                          setEditOpen(true);
                        }}
                      >
                        <Edit2
                          size={18}
                          style={{
                            color: 'var(--color-accent)',
                          }}
                        />
                      </button>

                      <button
                        title="Xóa"
                        className="
                          p-2
                          rounded-lg
                          hover:bg-red-50
                          transition
                        "
                        onClick={() => {
                          setSelectedProduct(product);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2
                          size={18}
                          className="text-red-500"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-gray-500">
            Hiển thị 1 - 5 / 5 sản phẩm
          </p>

          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">
              Trước
            </button>

            <button
              className="rounded-lg px-3 py-2 text-white"
              style={{
                backgroundColor:
                  'var(--color-primary)',
              }}
            >
              1
            </button>

            <button className="rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">
              Sau
            </button>
          </div>
        </div>
      </div>
      <ProductViewModal
        open={viewOpen}
        product={selectedProduct}
        onClose={() => setViewOpen(false)}
      />

      <ProductImagesModal
        open={imageOpen}
        product={selectedProduct}
        onClose={() => setImageOpen(false)}
      />

      <ProductFormModal
        open={editOpen}
        mode="edit"
        product={selectedProduct}
        onClose={() => setEditOpen(false)}
      />

      <DeleteProductModal
        open={deleteOpen}
        product={selectedProduct}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => { }}
      />
    </div>
  );
}