'use client';

import styles from './AddressCard.module.css';
import { AddressResponse } from '@/lib/addressService';

interface AddressCardProps {
  address: AddressResponse;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

/** Hiển thị một ô địa chỉ trong danh sách. */
export default function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div className={`${styles.card} ${address.isDefault ? styles.cardDefault : ''}`}>
      {/* Badge mặc định */}
      {address.isDefault && (
        <span className={styles.badge}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.868 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
          </svg>
          Địa chỉ mặc định
        </span>
      )}

      {/* Thông tin */}
      <div className={styles.info}>
        <p className={styles.name}>{address.contactName}</p>
        <p className={styles.phone}>{address.phone}</p>
        <p className={styles.fullAddress}>{address.fullNameAddress}</p>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {!address.isDefault && (
          <button
            className={styles.btnDefault}
            onClick={onSetDefault}
            title="Đặt làm địa chỉ mặc định"
          >
            Đặt mặc định
          </button>
        )}
        <button className={styles.btnEdit} onClick={onEdit}>
          Chỉnh sửa
        </button>
        <button
          className={styles.btnDelete}
          onClick={onDelete}
          disabled={address.isDefault}
          title={address.isDefault ? 'Không thể xóa địa chỉ mặc định' : 'Xóa địa chỉ'}
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
