import AdminLoginForm from "@/components/admin/AdminLoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | NongLamFood",
  description: "Đăng nhập dành cho Quản trị viên",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-gray-50 to-gray-200 p-4 font-sans">
      <AdminLoginForm />
    </div>
  );
}
