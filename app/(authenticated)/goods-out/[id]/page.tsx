"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useGetGoodsOutDetail } from "../__hooks/use-get-goods-out-detail.query";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Package, Calendar, User, FileText } from "lucide-react";

export default function GoodsOutDetailPage() {
  const params = useParams();
  const { data, isLoading } = useGetGoodsOutDetail(Number(params.id));
  const goodsOut = data?.data;

  return (
    <Page isLoading={isLoading} title="Detail Pengiriman" description="Informasi lengkap pengiriman barang">
      <Card className="shadow-none">
        <CardContent className="p-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ID Pengiriman:</span>
              <span className="font-medium">#{goodsOut?.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tanggal Kirim:</span>
              <span className="font-medium">
                {goodsOut?.shippedDate ? new Date(goodsOut.shippedDate).toLocaleDateString() : "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Customer:</span>
              <span className="font-medium">{goodsOut?.customerOrder?.customer?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Order #:</span>
              <span className="font-medium">{goodsOut?.customerOrder?.id}</span>
            </div>
          </div>

          {/* Catatan */}
          {goodsOut?.note && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Catatan:</h3>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{goodsOut.note}</p>
            </div>
          )}

          {/* Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Items yang Dikirim</h3>
            <Table>
              <TableBody>
                <TableRow className="bg-muted">
                  <TableCell>Kode Buku</TableCell>
                  <TableCell>Judul Buku</TableCell>
                  <TableCell className="text-right">Quantity</TableCell>
                </TableRow>
                {goodsOut?.items?.map((item) => {
                  const title = `${item.book.bookTitle.subject?.name || ""} Kelas ${item.book.bookTitle.grade} ${item.book.bookTitle.level}`;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.book.code}</TableCell>
                      <TableCell>{title}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                    </TableRow>
                  );
                })}
                {goodsOut?.items?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Tidak ada item</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}