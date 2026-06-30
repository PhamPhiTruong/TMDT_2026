'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  AddressResponse,
  AddressPayload,
} from '@/lib/addressService';

/**
 * Hook tập trung toàn bộ state & logic cho trang quản lý địa chỉ.
 * Component chỉ cần gọi hook này, không gọi service trực tiếp.
 */
export function useAddresses() {
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null); // null = thêm mới
  const [deleteTarget, setDeleteTarget] = useState<AddressResponse | null>(null); // address cần xóa

  // ── Fetch danh sách ──────────────────────────────────────────────────────
  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAddresses();
      setAddresses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // ── Mở modal ─────────────────────────────────────────────────────────────
  const openAddModal = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const openEditModal = (address: AddressResponse) => {
    setEditingAddress(address);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAddress(null);
  };

  // ── Submit form (thêm / sửa) ─────────────────────────────────────────────
  const handleSubmit = async (formData: AddressPayload) => {
    if (editingAddress) {
      await updateAddress(editingAddress.addressId, formData);
    } else {
      await addAddress(formData);
    }
    closeModal();
    await fetchAddresses();
  };

  // ── Xóa ──────────────────────────────────────────────────────────────────
  const confirmDelete = (address: AddressResponse) => setDeleteTarget(address);
  const cancelDelete = () => setDeleteTarget(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteAddress(deleteTarget.addressId);
    setDeleteTarget(null);
    await fetchAddresses();
  };

  // ── Đặt mặc định ─────────────────────────────────────────────────────────
  const handleSetDefault = async (addressId: number) => {
    await setDefaultAddress(addressId);
    await fetchAddresses();
  };

  return {
    addresses,
    loading,
    error,
    // modal
    modalOpen,
    editingAddress,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
    // delete confirm
    deleteTarget,
    confirmDelete,
    cancelDelete,
    handleDelete,
    // default
    handleSetDefault,
    // refresh
    fetchAddresses,
  };
}
