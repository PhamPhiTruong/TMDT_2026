'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { useAddresses } from '@/hooks/useAddresses';
import { useAuth } from '@/app/context/AuthContext';
import AddressCard from '@/components/account/AddressCard';
import AddressFormModal from '@/components/account/AddressFormModal';
import DeleteConfirmModal from '@/components/account/DeleteConfirmModal';

const MAX_ADDRESSES = 5;

/**
 * Trang "Địa chỉ của bạn" trong khu vực Tài khoản.
 * Route: /tai-khoan/dia-chi — yêu cầu người dùng đã đăng nhập.
 */
export default function AddressManagementPage() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  const {
    addresses,
    loading,
    error,
    modalOpen,
    editingAddress,
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
    deleteTarget,
    confirmDelete,
    cancelDelete,
    handleDelete,
    handleSetDefault,
  } = useAddresses();

  // Chặn truy cập nếu chưa đăng nhập
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/dang-nhap');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const canAdd = addresses.length < MAX_ADDRESSES;

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <a href="/">Trang chủ</a>
          <span>/</span>
          <span>Tài khoản</span>
          <span>/</span>
          <span>Địa chỉ</span>
        </nav>

        <div className={styles.layout}>
          {/* ── Sidebar ── */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>TRANG TÀI KHOẢN</div>
            <nav className={styles.sidebarNav}>
              <a
                href="/tai-khoan/dia-chi"
                className={`${styles.navLink} ${styles.navActive}`}
              >
                Sổ địa chỉ ({addresses.length})
              </a>
              <a href="/don-hang" className={styles.navLink}>
                Đơn hàng của tôi
              </a>
              <button
                type="button"
                className={styles.navLink}
                onClick={() => {
                  logout();
                  router.push('/');
                }}
              >
                Đăng xuất
              </button>
            </nav>
          </aside>

          {/* ── Main content ── */}
          <main className={styles.main}>
            {/* Page header */}
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>ĐỊA CHỈ CỦA BẠN</h1>
                <p className={styles.pageSubtitle}>
                  Quản lý địa chỉ nhận hàng ({addresses.length}/{MAX_ADDRESSES})
                </p>
              </div>
              <button
                className={styles.btnAdd}
                onClick={openAddModal}
                disabled={!canAdd}
                title={!canAdd ? `Đã đạt giới hạn ${MAX_ADDRESSES} địa chỉ` : ''}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Thêm địa chỉ
              </button>
            </div>

            {/* States */}
            {loading && (
              <div className={styles.stateBox}>
                <div className={styles.spinner} />
                <p>Đang tải địa chỉ...</p>
              </div>
            )}

            {!loading && error && (
              <div className={styles.errorBox}>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && addresses.length === 0 && (
              <div className={styles.emptyBox}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p className={styles.emptyTitle}>Chưa có địa chỉ nào</p>
                <p className={styles.emptyDesc}>Thêm địa chỉ để mua hàng nhanh hơn khi thanh toán.</p>
                <button className={styles.btnAdd} onClick={openAddModal}>
                  + Thêm địa chỉ đầu tiên
                </button>
              </div>
            )}

            {/* Address list */}
            {!loading && !error && addresses.length > 0 && (
              <div className={styles.list}>
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr.addressId}
                    address={addr}
                    onEdit={() => openEditModal(addr)}
                    onDelete={() => confirmDelete(addr)}
                    onSetDefault={() => handleSetDefault(addr.addressId)}
                  />
                ))}
              </div>
            )}

            {/* Limit warning */}
            {!canAdd && (
              <p className={styles.limitNote}>
                Bạn đã lưu tối đa {MAX_ADDRESSES} địa chỉ. Xóa một địa chỉ để thêm mới.
              </p>
            )}
          </main>
        </div>

        {/* Modals */}
        <AddressFormModal
          open={modalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          initialData={editingAddress}
        />

        <DeleteConfirmModal
          address={deleteTarget}
          onConfirm={handleDelete}
          onCancel={cancelDelete}
        />
      </div>
      <Footer />
    </>
  );
}
