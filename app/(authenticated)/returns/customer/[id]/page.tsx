"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useGetCustomerReturnDetail } from "../__hooks/use-get-customer-return-detail.query";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Calendar, User, FileText, Package } from "lucide-react";

export default function CustomerReturnDetailPage() {
  const params = useParams();
  const { data, isLoading } = useGetCustomerReturnDetail(Number(params.id));
  const customerReturn = data?.data;

  return (
    <Page isLoading={isLoading} title="Detail Retur Customer" description="Informasi lengkap retur dari customer">
      <Card className="shadow-none">
        <CardContent className="p-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ID Retur:</span>
              <span className="font-medium">#{customerReturn?.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tanggal Retur:</span>
              <span className="font-medium">
                {customerReturn?.returnDate ? new Date(customerReturn.returnDate).toLocaleDateString() : "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Customer:</span>
              <span className="font-medium">{customerReturn?.customer?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Institusi:</span>
              <span className="font-medium">{customerReturn?.customer?.institution}</span>
            </div>
          </div>

          {/* Alasan */}
          {customerReturn?.reason && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Alasan Retur:</h3>
              <p className="text-sm bg-muted p-3 rounded-md">{customerReturn.reason}</p>
            </div>
          )}

          {/* Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Items yang Diretur</h3>
            <Table>
              <TableBody>
                <TableRow className="bg-muted">
                  <TableCell>Kode Buku</TableCell>
                  <TableCell>Judul Buku</TableCell>
                  <TableCell className="text-right">Quantity</TableCell>
                </TableRow>
                {customerReturn?.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.book.code}</TableCell>
                    <TableCell>{item.book.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                  </TableRow>
                ))}
                {!customerReturn?.items?.length && (
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