"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/_components/ui/table";
import { Badge } from "@/app/_components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { RecentOrder } from "../__hooks/use-get-dashboard-stats.query";
import Link from "next/link";

interface RecentOrdersProps {
  orders: RecentOrder[];
  isLoading: boolean;
}

export const RecentOrders = ({ orders, isLoading }: RecentOrdersProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Memuat data...</div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-blue-500">Confirmed</Badge>;
      case "PARTIALLY_SHIPPED":
        return <Badge className="bg-yellow-500">Parsial</Badge>;
      case "SHIPPED":
        return <Badge className="bg-green-500">Shipped</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID");
  };

  const isUrgent = (deadline: string | null) => {
    if (!deadline) return false;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Order Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Belum ada order pending</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Qty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className={isUrgent(order.deadline) ? "bg-red-50" : ""}>
                  <TableCell>
                    <Link href={`/customer-orders/${order.id}`} className="font-medium hover:underline">
                      #{order.id}
                    </Link>
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>
                    {order.deadline ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className={isUrgent(order.deadline) ? "text-red-600 font-medium" : ""}>
                          {formatDate(order.deadline)}
                        </span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">{order.totalQuantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {orders.length > 0 && (
          <div className="mt-4 pt-2 text-right">
            <Link href="/customer-orders" className="text-xs text-primary hover:underline">
              Lihat semua order →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};