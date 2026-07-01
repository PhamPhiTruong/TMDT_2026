'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getUserProfile, updateUserProfile, UserProfile } from '@/lib/userService';
import { useAuth } from '@/app/context/AuthContext';

export default function ProfilePage() {
  const { updateUser } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getUserProfile();
      setProfile(data);
      setFullName(data.fullName || '');
      setPhone(data.phone || '');
      setDateOfBirth(data.dateOfBirth || '');
      setGender(data.gender || '');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải thông tin cá nhân');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!fullName.trim()) {
      setError('Vui lòng nhập họ tên');
      return;
    }
    
    setIsSaving(true);
    try {
      const updatedData = await updateUserProfile({
        fullName,
        phone,
        dateOfBirth: dateOfBirth || undefined,
        gender: gender || undefined,
      });
      
      setProfile(updatedData);
      setSuccess('Cập nhật thông tin thành công!');
      
      // Update the AuthContext so the Header reflects the changes immediately
      if (updateUser) {
        updateUser({ fullName: updatedData.fullName, avatar: updatedData.avatar || undefined });
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h1 className="text-xl font-bold text-gray-900">Hồ Sơ Của Tôi</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
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

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-center">
            <label className="text-sm font-medium text-gray-700">Email đăng nhập</label>
            <div className="md:col-span-2 relative">
              <input type="text" value={profile?.email || ''} disabled className="w-full border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-4 py-2.5 text-sm cursor-not-allowed" />
              {profile?.authProvider === 'GOOGLE' && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs font-semibold border border-blue-100">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Đã liên kết Google
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-center">
            <label className="text-sm font-medium text-gray-700">Họ tên <span className="text-danger">*</span></label>
            <div className="md:col-span-2">
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="w-full border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                placeholder="Nhập họ và tên"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-center">
            <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
            <div className="md:col-span-2">
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="w-full border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                placeholder="Ví dụ: 0912 345 678"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-center">
            <label className="text-sm font-medium text-gray-700">Giới tính</label>
            <div className="md:col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value="nam" checked={gender === 'nam'} onChange={() => setGender('nam')} className="text-primary focus:ring-primary w-4 h-4" />
                <span className="text-sm text-gray-700">Nam</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value="nu" checked={gender === 'nu'} onChange={() => setGender('nu')} className="text-primary focus:ring-primary w-4 h-4" />
                <span className="text-sm text-gray-700">Nữ</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value="khac" checked={gender === 'khac'} onChange={() => setGender('khac')} className="text-primary focus:ring-primary w-4 h-4" />
                <span className="text-sm text-gray-700">Khác</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-center">
            <label className="text-sm font-medium text-gray-700">Ngày sinh</label>
            <div className="md:col-span-2">
              <input 
                type="date" 
                value={dateOfBirth} 
                onChange={(e) => setDateOfBirth(e.target.value)} 
                className="w-full border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-center pt-4">
            <div className="hidden md:block"></div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang lưu...</> : 'Lưu Thay Đổi'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
