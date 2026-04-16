"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { convertUtcToLocalTime, toTitleCase } from "@/lib/utils";
import { useGetPurchaseOrder } from "./__hooks/use-get-purchase-order.query";

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const { data, isLoading } = useGetPurchaseOrder(Number(params.id));

  const po = data?.data;

  return (
    <Page
      isLoading={isLoading}
      title="Purchase Order Detail"
      description="Detail information about the purchase order."
    >
      <Card className="gap-3 shadow-none">
        <CardHeader>
          <CardTitle>PO Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="w-auto bg-background">PO ID</TableCell>
                <TableCell className="w-full">{po?.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Supplier</TableCell>
                <TableCell className="w-full">{po?.supplierName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Order Date</TableCell>
                <TableCell className="w-full">
                  {po?.orderDate
                    ? convertUtcToLocalTime({
                        utcDateStr: po.orderDate,
                        format: "dd MMM yyyy",
                      })
                    : "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Note</TableCell>
                <TableCell className="w-full">{po?.note || "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Created At</TableCell>
                <TableCell className="w-full">
                  {po?.createdAt
                    ? convertUtcToLocalTime({
                        utcDateStr: po.createdAt.toString(),
                        format: "PPpp",
                      })
                    : "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Last Updated At</TableCell>
                <TableCell className="w-full">
                  {po?.updatedAt
                    ? convertUtcToLocalTime({
                        utcDateStr: po.updatedAt.toString(),
                        format: "PPpp",
                      })
                    : "-"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {po?.items && po.items.length > 0 && (
        <Card className="gap-3 shadow-none mt-6">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="bg-background font-semibold">Book Code</TableCell>
                  <TableCell className="bg-background font-semibold">Book Title</TableCell>
                  <TableCell className="bg-background font-semibold text-right">Quantity</TableCell>
                </TableRow>
                {po.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.bookCode}</TableCell>
                    <TableCell>{item.displayTitle}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Page>
  );
}