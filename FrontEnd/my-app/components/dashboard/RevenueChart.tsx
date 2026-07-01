import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RevenueChart() {
    return (
        <Card>

            <CardHeader>
                <CardTitle>Doanh thu 7 ngày gần nhất</CardTitle>
            </CardHeader>

            <CardContent>

                <div className="flex h-80 items-center justify-center rounded-lg border border-dashed text-slate-400">
                    Revenue Chart
                </div>

            </CardContent>

        </Card>
    );
}