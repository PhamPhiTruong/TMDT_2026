'use client';

import { useState } from 'react';
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { changePassword } from '@/lib/userService';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!oldPassword) {
      setError('Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({ oldPassword, newPassword });
      setSuccess('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi khi đổi mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h1 className="text-xl font-bold text-gray-900">Đổi Mật Khẩu</h1>
        <p className="text-sm text-gray-500 mt-1">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm animate-fadeInUp">
          <AlertCircle className="w-5 h-5 mt-0 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-start gap-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm animate-fadeInUp">
          <CheckCircle2 className="w-5 h-5 mt-0 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-center">
            <label className="text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
            <div className="md:col-span-2 relative">
              <input 
                type={showOldPassword ? "text" : "password"}
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)} 
                className="w-full border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-center">
            <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
            <div className="md:col-span-2 relative">
              <input 
                type={showNewPassword ? "text" : "password"}
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className="w-full border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                placeholder="Nhập mật khẩu mới"
              />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-center">
            <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
            <div className="md:col-span-2 relative">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                placeholder="Xác nhận mật khẩu mới"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-center pt-4">
            <div className="hidden md:block"></div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...</> : 'Xác Nhận'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
