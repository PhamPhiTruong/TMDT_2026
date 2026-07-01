import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  // Tự động điều hướng về trang quản lý users khi vào /admin
  redirect('/admin/users');
}
