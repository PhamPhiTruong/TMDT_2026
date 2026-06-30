import { getAccessToken } from './authService';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const ADDRESS_API = `${API_BASE}/api/v1/addresses`;

// ─── Types ────────────────────────────────────────────────
export interface AddressResponse {
  addressId: number;
  contactName: string;
  phone: string;
  provinceId: number;
  districtId: number;
  wardId: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  detailAddress: string;
  fullNameAddress: string;
  isDefault: boolean;
}

export interface AddressPayload {
  contactName: string;
  phone: string;
  provinceId: number;
  districtId: number;
  wardId: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  detailAddress: string;
  isDefault: boolean;
}

interface ApiEnvelope<T> {
  code?: number;
  message?: string;
  details?: string[];
  data?: T;
}

function getAuthHeader(): HeadersInit {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token ?? ''}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json: ApiEnvelope<T> = await res.json();
  if (!res.ok) {
    const msg =
      json?.message ||
      (json?.details && json.details[0]) ||
      'Đã xảy ra lỗi, vui lòng thử lại.';
    throw new Error(msg);
  }
  return json.data as T;
}

/** Lấy danh sách tất cả địa chỉ của người dùng hiện tại */
export async function getAddresses(): Promise<AddressResponse[]> {
  const res = await fetch(ADDRESS_API, { headers: getAuthHeader() });
  return handleResponse<AddressResponse[]>(res);
}

/** Chi tiết một địa chỉ */
export async function getAddressById(addressId: number): Promise<AddressResponse> {
  const res = await fetch(`${ADDRESS_API}/${addressId}`, {
    headers: getAuthHeader(),
  });
  return handleResponse<AddressResponse>(res);
}

/** Thêm địa chỉ mới */
export async function addAddress(payload: AddressPayload): Promise<AddressResponse> {
  const res = await fetch(ADDRESS_API, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(payload),
  });
  return handleResponse<AddressResponse>(res);
}

/** Cập nhật địa chỉ */
export async function updateAddress(
  addressId: number,
  payload: AddressPayload
): Promise<AddressResponse> {
  const res = await fetch(`${ADDRESS_API}/${addressId}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(payload),
  });
  return handleResponse<AddressResponse>(res);
}

/** Đặt làm địa chỉ mặc định */
export async function setDefaultAddress(addressId: number): Promise<AddressResponse> {
  const res = await fetch(`${ADDRESS_API}/${addressId}/default`, {
    method: 'PUT',
    headers: getAuthHeader(),
  });
  return handleResponse<AddressResponse>(res);
}

/** Xóa địa chỉ */
export async function deleteAddress(addressId: number): Promise<void> {
  const res = await fetch(`${ADDRESS_API}/${addressId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  return handleResponse<void>(res);
}
