'use client';

import { useState } from 'react';
import styles from './DeleteConfirmModal.module.css';
import { AddressResponse } from '@/lib/addressService';

interface DeleteConfirmModalProps {
  address: AddressResponse | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

/** Modal xác nhận xóa địa chỉ. */
export default function DeleteConfirmModal({ address, onConfirm, onCancel }: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!address) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi, vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* Icon cảnh báo */}
        <div className={styles.iconWrap}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </div>

        <h3 className={styles.title}>Xóa địa chỉ?</h3>
        <p className={styles.desc}>
          Địa chỉ của <strong>{address.contactName}</strong> sẽ bị xóa vĩnh viễn.
          <br />
          <span className={styles.addressPreview}>{address.fullNameAddress}</span>
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onCancel} disabled={loading}>
            Hủy
          </button>
          <button className={styles.btnDelete} onClick={handleConfirm} disabled={loading}>
            {loading ? 'Đang xóa...' : 'Xóa địa chỉ'}
          </button>
        </div>
      </div>
    </div>
  );
}
