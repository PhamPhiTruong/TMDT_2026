import { getUserAccessToken } from './authService';

const API_URL = 'http://localhost:8080/api/v1/reports';

export interface ReportRequest {
  storeId: number;
  reason: string;
}

export interface StoreSimpleDTO {
  storeId: number;
  name: string;
}

export interface ReportDTO {
  reportId: number;
  storeId: number;
  storeName: string;
  userName: string;
  userEmail: string;
  reason: string;
  status: string;
  adminReply: string | null;
  adminName: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export const reportService = {
  async getStores(): Promise<StoreSimpleDTO[]> {
    const token = getUserAccessToken();
    const response = await fetch(`${API_URL}/stores`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch stores');
    const data = await response.json();
    return data.data;
  },

  async createReport(data: ReportRequest): Promise<void> {
    const token = getUserAccessToken();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.message || 'Failed to create report');
    }
  },

  async getMyReports(): Promise<ReportDTO[]> {
    const token = getUserAccessToken();
    const response = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch reports');
    const data = await response.json();
    return data.data;
  }
};
