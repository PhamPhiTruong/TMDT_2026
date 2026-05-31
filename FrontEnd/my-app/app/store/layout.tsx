import Sidebar from '@/components/store/dashboard/Sidebar';
import AdminHeader from '@/components/store/dashboard/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="md:ml-64 flex min-h-screen flex-col">
        <AdminHeader />

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
