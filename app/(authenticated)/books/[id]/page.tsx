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

  const { data, isLoading } = useGetBook(id);
  const { data: stockMovementsData } = useGetStockMovementsQuery(id);

  const book = data?.data;
  const stockMovements = stockMovementsData ?? [];
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  const totalStock = stockMovements.reduce((acc, mov) => acc + mov.quantity, 0);

  return (
    <Page
      isLoading={isLoading}
      title={book?.name || "Detail Buku"}
      description="Informasi lengkap identitas buku beserta riwayat stok"
      headerAction={
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
      {/* Informasi Buku */}
      <Card className="border shadow-none mb-8">
        <CardContent className="pt-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="w-1/3 font-medium bg-muted/50">Kode Buku</TableCell>
                <TableCell>{book?.code}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-muted/50">Nama Buku</TableCell>
                <TableCell className="font-medium">{book?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-muted/50">Mata Pelajaran</TableCell>
                <TableCell>{book?.subjectName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-muted/50">Kelas & Level</TableCell>
                <TableCell>{book?.grade} {book?.level}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-muted/50">Kurikulum • Semester</TableCell>
                <TableCell>
                  {book?.curriculum?.replace(/_/g, " ")} • {book?.semester}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-muted/50">Percetakan</TableCell>
                <TableCell>{book?.percetakanName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-muted/50">Jumlah Halaman</TableCell>
                <TableCell>{book?.pages ?? "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-muted/50">Tahun Terbit</TableCell>
                <TableCell>{book?.productionYear ?? "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-muted/50">Stok Saat Ini</TableCell>
                <TableCell className="text-2xl font-bold text-green-600">
                  {totalStock} eksemplar
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Riwayat Stock Movement */}
      <Card className="border shadow-none">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Riwayat Pergerakan Stok</h3>
            <Button onClick={() => setIsAdjustModalOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" /> Adjustment Stok
            </Button>
          </div>

          {stockMovements.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tipe Transaksi</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead>Referensi</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockMovements.map((mov) => (

                  <TableRow key={mov.id}>
                    <TableCell>
                      {mov.createdAt
                        ? convertUtcToLocalTime(mov.createdAt)?.toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : "-"
                      }
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={mov.quantity > 0 ? "default" : "destructive"}
                      >
                        {mov.type.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                    </TableCell>
                    <TableCell>
                      {mov.referenceType} #{mov.referenceId}
                    </TableCell>
                    <TableCell>{mov.note || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Belum ada riwayat pergerakan stok untuk buku ini.
            </p>
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