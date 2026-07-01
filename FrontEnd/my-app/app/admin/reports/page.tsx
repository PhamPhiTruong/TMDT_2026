'use client';

import { useState, useEffect } from 'react';
import { Loader2, Search, CheckCircle2, AlertOctagon, Send } from 'lucide-react';
import { adminReportService } from '@/lib/adminReportService';
import { ReportDTO } from '@/lib/reportService';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await adminReportService.getAllReports();
      setReports(data);
    } catch (err: any) {
      setError('Lỗi khi tải danh sách báo cáo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplySubmit = async (reportId: number) => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      await adminReportService.replyToReport(reportId, replyText);
      setReplyingTo(null);
      setReplyText('');
      fetchReports();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi phản hồi báo cáo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Báo cáo</h1>
          <p className="text-sm text-gray-500 mt-1">Xem xét và giải quyết các báo cáo vi phạm từ người dùng</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Người dùng</th>
                  <th className="px-6 py-4">Cửa hàng bị BC</th>
                  <th className="px-6 py-4 w-1/3">Lý do</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report.reportId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{report.reportId}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{report.userName}</div>
                      <div className="text-xs text-gray-500">{report.userEmail}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{formatDate(report.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold">
                        {report.storeName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-3">{report.reason}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {report.status === 'RESOLVED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Đã phản hồi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                          <AlertOctagon className="w-3 h-3" /> Đang chờ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {report.status !== 'RESOLVED' ? (
                        <button
                          onClick={() => setReplyingTo(replyingTo === report.reportId ? null : report.reportId)}
                          className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Phản hồi
                        </button>
                      ) : (
                        <button
                          onClick={() => setReplyingTo(replyingTo === report.reportId ? null : report.reportId)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-xs font-bold transition-colors"
                        >
                          Xem phản hồi
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reports.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">
                Không có báo cáo nào
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reply Section Modal/Expand */}
      {replyingTo !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">
                {reports.find(r => r.reportId === replyingTo)?.status === 'RESOLVED' ? 'Nội dung phản hồi' : 'Phản hồi báo cáo'}
              </h3>
              <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold px-2">&times;</button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl text-sm border border-gray-100">
                <span className="font-semibold block mb-1">Nội dung báo cáo:</span>
                <p className="text-gray-600">{reports.find(r => r.reportId === replyingTo)?.reason}</p>
              </div>
              
              {reports.find(r => r.reportId === replyingTo)?.status === 'RESOLVED' ? (
                <div className="bg-green-50 p-4 rounded-xl text-sm border border-green-100">
                  <span className="font-semibold text-green-800 block mb-1">Admin đã trả lời:</span>
                  <p className="text-green-700">{reports.find(r => r.reportId === replyingTo)?.adminReply}</p>
                </div>
              ) : (
                <div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    placeholder="Nhập nội dung phản hồi cho người dùng..."
                    className="w-full border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                  />
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors text-sm"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={() => handleReplySubmit(replyingTo)}
                      disabled={isSubmitting || !replyText.trim()}
                      className="px-5 py-2.5 bg-primary text-white font-medium hover:bg-primary-dark rounded-xl transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Gửi phản hồi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
