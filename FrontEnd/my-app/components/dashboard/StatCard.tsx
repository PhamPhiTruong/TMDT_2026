import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
    title: string;
    value: string;
    icon: ReactNode;
}

export default function StatCard({
    title,
    value,
    icon,
}: Props) {
    return (
        <Card>
            <CardContent className="flex items-center justify-between p-5">

                <div>
                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                        {value}
                    </h2>
                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                    {icon}
                </div>

            </CardContent>
        </Card>
    );
}