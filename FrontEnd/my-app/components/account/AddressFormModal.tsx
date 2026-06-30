'use client';

import { useState, useEffect } from 'react';
import styles from './AddressFormModal.module.css';
import { useGhnLocation } from '@/hooks/useGhnLocation';
import { AddressResponse, AddressPayload } from '@/lib/addressService';

const PHONE_REGEX = /^(\+84|0)[3-9]\d{8}$/;

interface FormState {
  contactName: string;
  phone: string;
  provinceId: number | '';
  districtId: number | '';
  wardId: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  detailAddress: string;
  isDefault: boolean;
}

const EMPTY_FORM: FormState = {
  contactName: '',
  phone: '',
  provinceId: '',
  districtId: '',
  wardId: '',
  provinceName: '',
  districtName: '',
  wardName: '',
  detailAddress: '',
  isDefault: false,
};

interface AddressFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: AddressPayload) => Promise<void>;
  initialData: AddressResponse | null;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

/** Modal thêm mới / chỉnh sửa địa chỉ. */
export default function AddressFormModal({ open, onClose, onSubmit, initialData }: AddressFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Hook gọi GHN API để lấy danh sách tỉnh/huyện/xã
  const { provinces, districts, wards, loadDistricts, loadWards, loadingLoc } = useGhnLocation();

  // Điền form khi edit
  useEffect(() => {
    if (!open) return;
    if (initialData) {
      setForm({
        contactName: initialData.contactName || '',
        phone: initialData.phone || '',
        provinceId: initialData.provinceId || '',
        districtId: initialData.districtId || '',
        wardId: initialData.wardId || '',
        provinceName: initialData.provinceName || '',
        districtName: initialData.districtName || '',
        wardName: initialData.wardName || '',
        detailAddress: initialData.detailAddress || '',
        isDefault: initialData.isDefault || false,
      });
      if (initialData.provinceId) loadDistricts(initialData.provinceId);
      if (initialData.districtId) loadWards(initialData.districtId);
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
    setServerError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData]);

  if (!open) return null;

  // ── Field change ────────────────────────────────────────────────────────
  const set = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = provinces.find((p) => p.ProvinceID === Number(e.target.value));
    setForm((prev) => ({
      ...prev,
      provinceId: selected?.ProvinceID || '',
      provinceName: selected?.ProvinceName || '',
      districtId: '',
      districtName: '',
      wardId: '',
      wardName: '',
    }));
    if (selected) loadDistricts(selected.ProvinceID);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = districts.find((d) => d.DistrictID === Number(e.target.value));
    setForm((prev) => ({
      ...prev,
      districtId: selected?.DistrictID || '',
      districtName: selected?.DistrictName || '',
      wardId: '',
      wardName: '',
    }));
    if (selected) loadWards(selected.DistrictID);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = wards.find((w) => w.WardCode === e.target.value);
    setForm((prev) => ({
      ...prev,
      wardId: selected?.WardCode || '',
      wardName: selected?.WardName || '',
    }));
  };

  // ── Validate ────────────────────────────────────────────────────────────
  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.contactName.trim()) errs.contactName = 'Không được để trống';
    if (!form.phone.trim()) {
      errs.phone = 'Không được để trống';
    } else if (!PHONE_REGEX.test(form.phone.trim())) {
      errs.phone = 'Số điện thoại không hợp lệ (VD: 0912345678)';
    }
    if (!form.provinceId) errs.provinceId = 'Vui lòng chọn tỉnh/thành';
    if (!form.districtId) errs.districtId = 'Vui lòng chọn quận/huyện';
    if (!form.wardId) errs.wardId = 'Vui lòng chọn phường/xã';
    return errs;
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setServerError('');
    try {
      await onSubmit({
        contactName: form.contactName.trim(),
        phone: form.phone.trim(),
        provinceId: Number(form.provinceId),
        districtId: Number(form.districtId),
        wardId: String(form.wardId),
        provinceName: form.provinceName,
        districtName: form.districtName,
        wardName: form.wardName,
        detailAddress: form.detailAddress.trim(),
        isDefault: form.isDefault,
      });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = !!initialData;
  const title = isEdit ? 'CHỈNH SỬA ĐỊA CHỈ' : 'THÊM ĐỊA CHỈ MỚI';

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Header */}
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {serverError && <p className={styles.serverError}>{serverError}</p>}

          {/* Họ tên */}
          <div className={styles.field}>
            <label className={styles.label}>
              Họ và tên người nhận <span className={styles.required}>*</span>
            </label>
            <input
              className={`${styles.input} ${errors.contactName ? styles.inputError : ''}`}
              type="text"
              placeholder="Nguyễn Văn A"
              value={form.contactName}
              onChange={(e) => set('contactName', e.target.value)}
              maxLength={150}
            />
            {errors.contactName && <p className={styles.error}>{errors.contactName}</p>}
          </div>

          {/* Số điện thoại */}
          <div className={styles.field}>
            <label className={styles.label}>
              Số điện thoại <span className={styles.required}>*</span>
            </label>
            <input
              className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
              type="tel"
              placeholder="0912345678"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              maxLength={15}
            />
            {errors.phone && <p className={styles.error}>{errors.phone}</p>}
          </div>

          {/* Tỉnh / Quận / Phường — 3 cột */}
          <div className={styles.row3}>
            {/* Tỉnh */}
            <div className={styles.field}>
              <label className={styles.label}>
                Tỉnh / Thành phố <span className={styles.required}>*</span>
              </label>
              <select
                className={`${styles.select} ${errors.provinceId ? styles.inputError : ''}`}
                value={form.provinceId}
                onChange={handleProvinceChange}
                disabled={loadingLoc}
              >
                <option value="">-- Chọn tỉnh/thành --</option>
                {provinces.map((p) => (
                  <option key={p.ProvinceID} value={p.ProvinceID}>
                    {p.ProvinceName}
                  </option>
                ))}
              </select>
              {errors.provinceId && <p className={styles.error}>{errors.provinceId}</p>}
            </div>

            {/* Quận */}
            <div className={styles.field}>
              <label className={styles.label}>
                Quận / Huyện <span className={styles.required}>*</span>
              </label>
              <select
                className={`${styles.select} ${errors.districtId ? styles.inputError : ''}`}
                value={form.districtId}
                onChange={handleDistrictChange}
                disabled={!form.provinceId || loadingLoc}
              >
                <option value="">-- Chọn quận/huyện --</option>
                {districts.map((d) => (
                  <option key={d.DistrictID} value={d.DistrictID}>
                    {d.DistrictName}
                  </option>
                ))}
              </select>
              {errors.districtId && <p className={styles.error}>{errors.districtId}</p>}
            </div>

            {/* Phường */}
            <div className={styles.field}>
              <label className={styles.label}>
                Phường / Xã <span className={styles.required}>*</span>
              </label>
              <select
                className={`${styles.select} ${errors.wardId ? styles.inputError : ''}`}
                value={form.wardId}
                onChange={handleWardChange}
                disabled={!form.districtId || loadingLoc}
              >
                <option value="">-- Chọn phường/xã --</option>
                {wards.map((w) => (
                  <option key={w.WardCode} value={w.WardCode}>
                    {w.WardName}
                  </option>
                ))}
              </select>
              {errors.wardId && <p className={styles.error}>{errors.wardId}</p>}
            </div>
          </div>

          {/* Địa chỉ cụ thể */}
          <div className={styles.field}>
            <label className={styles.label}>Số nhà, tên đường</label>
            <input
              className={styles.input}
              type="text"
              placeholder="VD: Số 12, Đường 30/4"
              value={form.detailAddress}
              onChange={(e) => set('detailAddress', e.target.value)}
              maxLength={255}
            />
          </div>

          {/* Đặt mặc định */}
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={form.isDefault}
              onChange={(e) => set('isDefault', e.target.checked)}
            />
            <span>Đặt làm địa chỉ mặc định</span>
          </label>

          {/* Buttons */}
          <div className={styles.footer}>
            <button type="button" className={styles.btnCancel} onClick={onClose} disabled={submitting}>
              Hủy
            </button>
            <button type="submit" className={styles.btnSubmit} disabled={submitting}>
              {submitting ? 'Đang lưu...' : isEdit ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
