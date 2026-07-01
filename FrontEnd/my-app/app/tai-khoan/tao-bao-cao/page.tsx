'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { reportService, StoreSimpleDTO } from '@/lib/reportService';

export default function CreateReportPage() {
  const [stores, setStores] = useState<StoreSimpleDTO[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<number | ''>('');
  const [reason, setReason] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await reportService.getStores();
        setStores(data);
      } catch (err: any) {
        setError('Không thể tải danh sách cửa hàng');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedStoreId) {
      setError('Vui lòng chọn cửa hàng cần báo cáo');
      return;
    }
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do báo cáo');
      return;
    }

    setIsSubmitting(true);
    try {
      await reportService.createReport({ storeId: Number(selectedStoreId), reason });
      setSuccess('Gửi báo cáo thành công! Quản trị viên sẽ xem xét và phản hồi sớm nhất.');
      setSelectedStoreId('');
      setReason('');
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi gửi báo cáo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Tạo Báo Cáo</h1>
        <p className="text-sm text-gray-500 mt-1">Báo cáo cửa hàng có dấu hiệu vi phạm</p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-start gap-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn cửa hàng <span className="text-red-500">*</span></label>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            >
              <option value="">-- Vui lòng chọn cửa hàng --</option>
              {stores.map(store => (
                <option key={store.storeId} value={store.storeId}>{store.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lý do báo cáo <span className="text-red-500">*</span></label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              placeholder="Vui lòng mô tả chi tiết lý do bạn báo cáo cửa hàng này..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang gửi...</> : 'Gửi Báo Cáo'}
          </button>
        </form>
      )}
    </div>
  );
}
