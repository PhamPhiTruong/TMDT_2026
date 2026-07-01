"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { SidebarProvider } from "@/providers/SidebarProvider";

interface Props {
    children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
    return (
        <div className="flex h-screen bg-slate-100">
            <SidebarProvider>

                <Sidebar />

                <div className="flex flex-1 flex-col overflow-hidden">
                    <Header />

                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
}