"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface Props {
    item: {
        title: string;
        href: string;
        icon: LucideIcon;
    };

    active: boolean;
}

export default function SidebarItem({
    item,
    active,
}: Props) {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={clsx(
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-all",
                active
                    ? "bg-green-500 text-white"
                    : "hover:bg-slate-100"
            )}
        >
            <Icon size={20} />

            <span>{item.title}</span>
        </Link>
    );
}