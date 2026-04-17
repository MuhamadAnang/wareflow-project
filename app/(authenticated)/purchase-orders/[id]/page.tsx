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
      title="Detail Belanja"
      description="Detail informasi tentang belanja buku ke supplier."
    >
      <Card className="gap-3 shadow-none">
        <CardHeader>
          <CardTitle>Detail</CardTitle>
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
                <TableCell className="w-auto bg-background">Tanggal Pesanan</TableCell>
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
                <TableCell className="w-auto bg-background">Catatan</TableCell>
                <TableCell className="w-full">{po?.note || "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Dibuat Pada</TableCell>
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
                <TableCell className="w-auto bg-background">Terakhir Diperbarui</TableCell>
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
            <CardTitle>Item</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="bg-background font-semibold">Kode Buku </TableCell>
                  <TableCell className="bg-background font-semibold">Judul Buku</TableCell>
                  <TableCell className="bg-background font-semibold text-right">Jumlah</TableCell>
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