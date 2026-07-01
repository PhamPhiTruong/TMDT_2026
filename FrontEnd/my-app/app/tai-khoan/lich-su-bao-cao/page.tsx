'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import { reportService, ReportDTO } from '@/lib/reportService';

export default function ReportHistoryPage() {
  const [reports, setReports] = useState<ReportDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await reportService.getMyReports();
        setReports(data);
      } catch (err: any) {
        setError('Không thể tải lịch sử báo cáo');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div>
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Lịch Sử Báo Cáo</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý các báo cáo bạn đã gửi</p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Bạn chưa gửi báo cáo nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.reportId} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">Cửa hàng: {report.storeName}</h3>
                  <p className="text-xs text-gray-500 mt-1">Ngày gửi: {formatDate(report.createdAt)}</p>
                </div>
                {report.status === 'RESOLVED' ? (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã phản hồi
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                    <Clock className="w-3.5 h-3.5" /> Đang chờ
                  </span>
                )}
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-700 mb-3">
                <span className="font-semibold block mb-1">Lý do báo cáo:</span>
                <p className="whitespace-pre-wrap">{report.reason}</p>
              </div>

              {report.status === 'RESOLVED' && report.adminReply && (
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">
                      A
                    </div>
                    <span className="font-semibold text-blue-900">Phản hồi từ Admin ({report.adminName}):</span>
                  </div>
                  <p className="text-blue-800 whitespace-pre-wrap pl-8">{report.adminReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
