import DashboardLayout from "@/components/layout/DashboardLayout";
import StoreOwnerGuard from "@/components/auth/StoreOwnerGuard";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <StoreOwnerGuard>
            <DashboardLayout>{children}</DashboardLayout>
        </StoreOwnerGuard>
    );
}
