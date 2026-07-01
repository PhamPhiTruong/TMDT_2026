import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function RecentOrders() {
    return (
        <Card>

            <CardHeader>
                <CardTitle>Đơn hàng gần đây</CardTitle>
            </CardHeader>

            <CardContent>

                <div className="space-y-4">

                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="flex items-center justify-between border-b pb-3"
                        >
                            <div>

                                <p className="font-medium">
                                    Đơn #{item}
                                </p>

                                <p className="text-sm text-slate-500">
                                    Khách hàng
                                </p>

                            </div>

                            <span className="font-semibold">
                                320.000đ
                            </span>

                        </div>
                    ))}

                </div>

            </CardContent>

        </Card>
    );
}