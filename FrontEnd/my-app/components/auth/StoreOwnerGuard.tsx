"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
    role?: string;
}

export default function StoreOwnerGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("currentUser");
            if (!raw) {
                router.replace("/dang-nhap-chu-cua-hang");
                return;
            }
            const user: User = JSON.parse(raw);
            if (user.role !== "ROLE_SELLER" && user.role !== "ROLE_ADMIN") {
                router.replace("/dang-nhap-chu-cua-hang");
                return;
            }
            setAllowed(true);
        } catch {
            router.replace("/dang-nhap-chu-cua-hang");
        }
    }, [router]);

    if (!allowed) return null;
    return <>{children}</>;
}