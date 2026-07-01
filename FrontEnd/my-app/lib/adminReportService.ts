import { getAdminAccessToken } from './adminAuthService';
import { ReportDTO } from './reportService';

const API_URL = 'http://localhost:8080/api/admin/reports';

export const adminReportService = {
  async getAllReports(): Promise<ReportDTO[]> {
    const token = getAdminAccessToken();
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch reports');
    const data = await response.json();
    return data.data;
  },

  async replyToReport(reportId: number, responseText: string): Promise<void> {
    const token = getAdminAccessToken();
    const response = await fetch(`${API_URL}/${reportId}/reply`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ response: responseText })
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.message || 'Failed to reply to report');
    }
  }
};
