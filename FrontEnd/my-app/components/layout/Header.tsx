"use client";

import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">

            <div className="flex items-center gap-4">

                <Search className="text-gray-400" size={18} />

                <Input
                    placeholder="Search..."
                    className="w-80"
                />

            </div>

            <div className="flex items-center gap-6">

                <Bell className="cursor-pointer" />

                <Avatar>
                    <AvatarFallback>TD</AvatarFallback>
                </Avatar>

            </div>

        </header>
    );
}