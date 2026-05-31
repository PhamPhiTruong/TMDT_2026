import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import RegisterForm from "@/components/Registerform";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký | NongLamFood",
  description: "Đăng ký tài khoản NongLamFood để mua sắm và theo dõi đơn hàng",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/tai-khoan" className="hover:text-primary transition-colors">
              Tài khoản
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-700 font-medium">Đăng ký</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 py-12 px-4">
        <RegisterForm />
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
