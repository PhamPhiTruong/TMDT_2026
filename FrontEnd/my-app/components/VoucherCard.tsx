'use client';

import { useState } from 'react';
import { Copy, Check, Info, X } from 'lucide-react';
import { Voucher } from '../app/data/homepageData';

interface VoucherCardProps {
  voucher: Voucher;
}

export default function VoucherCard({ voucher }: VoucherCardProps) {
  const [copied, setCopied] = useState(false);
  const [showConditions, setShowConditions] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(voucher.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Lỗi khi sao chép mã:', err);
    }
  };

  return (
    <>
      <div className="relative bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm overflow-hidden border-dashed hover:border-primary/50 transition-all duration-200">
        {/* Vòng tròn bên trái & phải mô phỏng vé giảm giá */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 border-r border-gray-200 rounded-r-full"></div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 border-l border-gray-200 rounded-l-full"></div>

        <div>
          <div className="flex items-start justify-between mb-2">
            <span className="bg-primary/10 text-primary font-extrabold text-xs px-2.5 py-1 rounded-md tracking-wider">
              {voucher.code}
            </span>
            <span className="text-xs font-bold text-red-600">
              {voucher.valueText}
            </span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2 pr-2 mb-4 font-medium leading-relaxed">
            {voucher.description}
          </p>
        </div>

        <div className="flex gap-2 items-center mt-auto">
          <button
            onClick={handleCopy}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${
              copied
                ? 'bg-green-600 text-white shadow-sm shadow-green-100'
                : 'bg-primary hover:bg-primary-dark text-white hover:shadow-sm hover:shadow-primary/20'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Đã chép
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Sao chép
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowConditions(true)}
            className="w-9 h-9 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-gray-50 text-gray-500 hover:text-primary flex items-center justify-center transition-all shrink-0"
            title="Xem điều kiện"
            aria-label="Điều kiện"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal điều kiện sử dụng */}
      {showConditions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeInUp">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowConditions(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-bold text-gray-900 mb-4 pr-6">
              Điều kiện áp dụng mã {voucher.code}
            </h3>
            
            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <p>• Mã giảm giá: <strong className="text-primary">{voucher.code}</strong></p>
              <p>• Mức giảm: <strong>{voucher.valueText}</strong> (Trừ trực tiếp vào đơn hàng).</p>
              <p>• Đơn hàng tối thiểu: <strong>{voucher.minOrderValue.toLocaleString('vi-VN')} VNĐ</strong>.</p>
              <p>• Thời gian áp dụng: Đến khi có thông báo mới.</p>
              <p>• Chỉ áp dụng cho các sản phẩm nông sản và trái cây sấy nguyên chất thuộc hệ thống NongLamFood.</p>
              <p>• Mỗi khách hàng được sử dụng mã tối đa 1 lần.</p>
            </div>

            <button
              onClick={() => {
                handleCopy();
                setShowConditions(false);
              }}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md hover:shadow-primary/20"
            >
              Sao chép mã ngay
            </button>
          </div>
        </div>
      )}
    </>
  );
}
