'use client';

import { useState, useEffect } from 'react';

/**
 * Hook lấy danh sách Tỉnh / Quận / Phường từ API GHN (Giao Hàng Nhanh).
 *
 * ⚠️  Cần cấu hình biến môi trường NEXT_PUBLIC_GHN_TOKEN với token thật
 *     lấy từ https://sso.ghn.vn
 *
 * Nếu dự án đổi sang đơn vị vận chuyển khác (GHTK, ViettelPost, ...),
 * chỉ cần thay các hàm fetch bên dưới và điều chỉnh cấu trúc response.
 */

export interface GhnProvince {
  ProvinceID: number;
  ProvinceName: string;
}

export interface GhnDistrict {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
}

export interface GhnWard {
  WardCode: string;
  DistrictID: number;
  WardName: string;
}

const GHN_TOKEN = process.env.NEXT_PUBLIC_GHN_TOKEN ?? 'YOUR_GHN_TOKEN';
const GHN_HEADERS = {
  'Content-Type': 'application/json',
  Token: GHN_TOKEN,
};

export function useGhnLocation() {
  const [provinces, setProvinces] = useState<GhnProvince[]>([]);
  const [districts, setDistricts] = useState<GhnDistrict[]>([]);
  const [wards, setWards] = useState<GhnWard[]>([]);
  const [loadingLoc, setLoadingLoc] = useState(false);

  // Load danh sách tỉnh/thành ngay khi hook được dùng
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingLoc(true);
      try {
        const res = await fetch(
          'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
          { headers: GHN_HEADERS }
        );
        const json = await res.json();
        setProvinces(json.data || []);
      } catch (err) {
        console.error('Không tải được danh sách tỉnh:', err);
      } finally {
        setLoadingLoc(false);
      }
    };
    fetchProvinces();
  }, []);

  const loadDistricts = async (provinceId: number | string) => {
    setDistricts([]);
    setWards([]);
    setLoadingLoc(true);
    try {
      const res = await fetch(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
        {
          method: 'POST',
          headers: GHN_HEADERS,
          body: JSON.stringify({ province_id: Number(provinceId) }),
        }
      );
      const json = await res.json();
      setDistricts(json.data || []);
    } catch (err) {
      console.error('Không tải được danh sách quận/huyện:', err);
    } finally {
      setLoadingLoc(false);
    }
  };

  const loadWards = async (districtId: number | string) => {
    setWards([]);
    setLoadingLoc(true);
    try {
      const res = await fetch(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id',
        {
          method: 'POST',
          headers: GHN_HEADERS,
          body: JSON.stringify({ district_id: Number(districtId) }),
        }
      );
      const json = await res.json();
      setWards(json.data || []);
    } catch (err) {
      console.error('Không tải được danh sách phường/xã:', err);
    } finally {
      setLoadingLoc(false);
    }
  };

  return { provinces, districts, wards, loadDistricts, loadWards, loadingLoc };
}
