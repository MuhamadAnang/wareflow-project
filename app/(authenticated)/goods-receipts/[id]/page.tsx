"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { convertUtcToLocalTime } from "@/lib/utils";
import { useGetGoodsReceipt } from "./__hooks/use-get-good-receipt.query";

export default function GoodsReceiptDetailPage() {
  const params = useParams();
  const { data, isLoading } = useGetGoodsReceipt(Number(params.id));
  const receipt = data?.data;

  return (
    <Page isLoading={isLoading} title="Goods Receipt Detail" description="Detail penerimaan barang">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Informasi Penerimaan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow><TableCell className="w-auto bg-background">ID</TableCell><TableCell>{receipt?.id}</TableCell></TableRow>
              <TableRow><TableCell className="w-auto bg-background">Supplier</TableCell><TableCell>{receipt?.supplierName}</TableCell></TableRow>
              <TableRow><TableCell className="w-auto bg-background">No. PO</TableCell><TableCell>{receipt?.purchaseOrderId}</TableCell></TableRow>
              <TableRow><TableCell className="w-auto bg-background">Tanggal Terima</TableCell><TableCell>{receipt?.receivedDate ? new Date(receipt.receivedDate).toLocaleDateString("id-ID") : "-"}</TableCell></TableRow>
              <TableRow><TableCell className="w-auto bg-background">Catatan</TableCell><TableCell>{receipt?.note || "-"}</TableCell></TableRow>
              <TableRow><TableCell className="w-auto bg-background">Dibuat Pada</TableCell><TableCell>{receipt?.createdAt ? convertUtcToLocalTime({ utcDateStr: receipt.createdAt.toString(), format: "PPpp" }) : "-"}</TableCell></TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {receipt?.items && receipt.items.length > 0 && (
        <Card className="shadow-none mt-6">
          <CardHeader><CardTitle>Items</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow><TableCell className="bg-background font-semibold">Kode Buku</TableCell><TableCell className="bg-background font-semibold">Judul Buku</TableCell><TableCell className="bg-background font-semibold text-right">Quantity</TableCell></TableRow>
                {receipt.items.map((item) => (
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