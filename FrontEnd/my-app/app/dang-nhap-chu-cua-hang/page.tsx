import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function StoreOwnerLoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <div className="border-b border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 py-2.5">
                    <nav className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary transition-colors">
                            Trang chủ
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-700 font-medium">Đăng nhập chủ cửa hàng</span>
                    </nav>
                </div>
            </div>

            <main className="flex-1 py-12 px-4">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-center mb-2">Đăng nhập Chủ cửa hàng</h1>
                    <p className="text-gray-500 text-center mb-6">
                        Đăng nhập để quản lý cửa hàng trên NongLamFood
                    </p>
                    <LoginForm />
                </div>
            </main>

            <Footer />
            <FloatingButtons />
        </div>
    );
}