"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useGetBook } from "./__hooks/use-get-book.query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { convertUtcToLocalTime, toTitleCase } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { Pencil, Plus } from "lucide-react";
import { useGetStockMovementsQuery } from "./__hooks/use-get-movements.query";
import { useState } from "react";
import { AdjustStockModal } from "./__components/adjust-stock-modal";

export default function BookDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, error } = useGetBook(id);
  const { data: stockMovementsData } = useGetStockMovementsQuery(id);
  const stockMovements = stockMovementsData ?? [];
  const book = data?.data;
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  // const { data: stockMovements } = useGetStockMovementsQuery(id);
  
  if (error) {
    return (
      <Page title="Detail Buku" isLoading={false}>
        <div className="text-red-600 p-4 bg-red-50 rounded">
          Gagal memuat detail buku: {error.message || "Terjadi kesalahan"}
        </div>
      </Page>
    );
  }

  return (
    <Page
      isLoading={isLoading}
      title="Detail Buku"
      description="Informasi lengkap mengenai varian buku fisik ini, termasuk judul gabungan, penerbit, semester, dan spesifikasi lainnya."
      headerAction={
        // <Link href={`/books/${id}/update`}>
        //   <Button variant="outline">
        //     <Pencil className="mr-2 h-4 w-4" /> Edit Buku
        //   </Button>
        // </Link>
        <div className="flex gap-2">
          <Link href={`/books/${id}/update`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" /> Edit Buku
            </Button>
          </Link>
          <Button onClick={() => setIsAdjustModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Adjustment Stok
          </Button>
        </div>
      }
    >
      <Card className="border shadow-none">
        <CardContent className="pt-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="w-1/3 font-medium bg-muted/50">Kode Buku</TableCell>
                <TableCell>{book?.code || "-"}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium bg-muted/50">Judul Buku</TableCell>
                <TableCell>{book?.displayTitle || "Tidak Diketahui"}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium bg-muted/50">Mata Pelajaran</TableCell>
                <TableCell>{book?.subjectName || "-"}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium bg-muted/50">Penerbit</TableCell>
                <TableCell>{book?.supplierName || "-"}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium bg-muted/50">Semester</TableCell>
                <TableCell>
                  {book?.semester ? (
                    <Badge variant="secondary">{toTitleCase(book.semester)}</Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium bg-muted/50">Jumlah Halaman</TableCell>
                <TableCell>{book?.pages ?? "-"}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium bg-muted/50">Tahun Terbit</TableCell>
                <TableCell>{book?.productionYear ?? "-"}</TableCell>
              </TableRow>

              {/* Kalau nanti tambah createdAt/updatedAt di schema books */}
              {/* <TableRow>
                <TableCell className="font-medium bg-muted/50">Dibuat Pada</TableCell>
                <TableCell>
                  {book?.createdAt ? convertUtcToLocalTime(book.createdAt) : "-"}
                </TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
          {book && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Riwayat Pergerakan Stok</h3>

              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <p className="text-sm font-medium">Stok Saat Ini</p>
                <p className="text-2xl font-bold">
                  {/* {stockData?.reduce((acc, mov) => acc + mov.quantity, 0) ?? 0} */}
                  {stockMovements.reduce<number>((acc, mov) => acc + mov.quantity, 0) || 0}
                </p>
              </div>

              {stockMovements?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Referensi</TableHead>
                      <TableHead>Catatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockMovements.map((mov) => (
                      <TableRow key={mov.id}>
                        {/* <TableCell>{convertUtcToLocalTime(mov.createdAt)}</TableCell> */}
                        <TableCell>
                          {convertUtcToLocalTime({ utcDateStr: mov.createdAt.toDateString() })?.toString() ?? "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={mov.quantity > 0 ? "default" : "destructive"}>
                            {mov.type.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>{mov.quantity}</TableCell>
                        <TableCell>
                          {mov.referenceType} #{mov.referenceId}
                        </TableCell>
                        <TableCell>{mov.note || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Belum ada pergerakan stok untuk buku ini.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <AdjustStockModal
        bookId={id}
        open={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
      />
    </Page>
  );
}
