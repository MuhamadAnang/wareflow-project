"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useGetCustomerOrder } from "../__hooks/use-get-customer-order.query";
import { useUpdateOrderStatusMutation } from "../__hooks/use-update-order-status.mutation";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { toTitleCase } from "@/lib/utils";

export default function CustomerOrderDetailPage() {
  const params = useParams();
  const { data, isLoading, refetch } = useGetCustomerOrder(Number(params.id));
  const { mutateAsync: updateStatus } = useUpdateOrderStatusMutation(Number(params.id));

  const order = data?.data;

  const handleStatusChange = async (newStatus: string) => {
    await updateStatus({ status: newStatus as any });
    refetch();
  };

  const statusTransitions: Record<string, string[]> = {
    DRAFT: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPED", "CANCELLED"],
    PARTIALLY_SHIPPED: ["SHIPPED", "CANCELLED"],
    SHIPPED: [],
    CANCELLED: [],
  };

  const availableActions = order ? statusTransitions[order.status] || [] : [];

  return (
    <Page isLoading={isLoading} title="Customer Order Detail" description="View order details and update status.">
      <Card className="shadow-none">
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="bg-muted w-40">Order ID</TableCell>
                <TableCell>{order?.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="bg-muted">Customer</TableCell>
                <TableCell>{order?.customer?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="bg-muted">Order Date</TableCell>
                <TableCell>{order?.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="bg-muted">Status</TableCell>
                <TableCell>
                  <Badge>{toTitleCase(order?.status || "")}</Badge>
                  {availableActions.length > 0 && (
                    <div className="mt-3 space-x-2">
                      {availableActions.map((action) => (
                        <Button key={action} size="sm" variant="outline" onClick={() => handleStatusChange(action)}>
                          {toTitleCase(action)}
                        </Button>
                      ))}
                    </div>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="bg-muted">Note</TableCell>
                <TableCell>{order?.note || "-"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h3 className="text-lg font-semibold mt-6 mb-3">Order Items</h3>
          <Table>
            <TableBody>
              <TableRow className="bg-muted">
                <TableCell>Book Code</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Ordered Qty</TableCell>
                <TableCell>Shipped Qty</TableCell>
                <TableCell>Remaining</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Subtotal</TableCell>
              </TableRow>
              {order?.items?.map((item) => {
                const title = `${item.book?.bookTitle?.subject?.name || ""} Kelas ${item.book?.bookTitle?.grade || ""} ${item.book?.bookTitle?.level || ""}`;
                const subtotal = Number(item.price) * item.quantity;
                const shippedQty = (item as any).shippedQuantity || 0;
                const remainingQty = (item as any).remainingQuantity || item.quantity;
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.book?.code}</TableCell>
                    <TableCell>{title.trim()}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{shippedQty}</TableCell>
                    <TableCell>{remainingQty}</TableCell>
                    <TableCell>Rp {Number(item.price).toLocaleString()}</TableCell>
                    <TableCell>Rp {subtotal.toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
              {!order?.items?.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No items</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Page>
  );
}