"use client";

import Page from "@/app/_components/page";
import { useGetGoodsReceiptsQuery } from "./__hooks/use-get-goods-receipts.query";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexGoodsReceiptQuerySchema } from "@/schemas/goods-receipt.schema";
import Link from "next/link";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/app/_components/ui/button";
import DataTable from "@/app/_components/data-table";
import { TGoodsReceiptWithItems } from "@/types/database";
import { useDeleteGoodsReceiptMutation } from "./__hooks/use-delete-goods-receipt.mutation";

const columns: ColumnDef<TGoodsReceiptWithItems>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "supplierName", header: "Supplier" },
  { accessorKey: "purchaseOrderId", header: "No. PO" },
  {
    accessorKey: "receivedDate",
    header: "Tanggal Terima",
    cell: ({ row }) => new Date(row.original.receivedDate).toLocaleDateString("id-ID"),
  },
  { accessorKey: "note", header: "Catatan", cell: ({ row }) => row.original.note || "-" },
  {
    accessorKey: "createdAt",
    header: "Dibuat Pada",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString("id-ID"),
  },
];

export default function GoodsReceiptsPage() {
  const { search, handleChange, pagination, filters } = useFilters(IndexGoodsReceiptQuerySchema);
  const { mutateAsync: deleteAsync, isPending: deletePending } = useDeleteGoodsReceiptMutation();

  const { data, isLoading } = useGetGoodsReceiptsQuery({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search: search || undefined,
    sort: filters.sort,
  });
  const columns: ColumnDef<TGoodsReceiptWithItems>[] = [
    // id, supplierName, purchaseOrderId, receivedDate, note, createdAt
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "supplierName",
      header: "Supplier",
    },
    {
      accessorKey: "purchaseOrderId",
      header: "No. PO",
    },
    {
      accessorKey: "receivedDate",
      header: "Tanggal Terima",
      cell: ({ row }) =>
        row.original.receivedDate
          ? new Date(row.original.receivedDate).toLocaleDateString("id-ID")
          : "-",
    },
    {
      accessorKey: "note",
      header: "Catatan",
      cell: ({ row }) => row.original.note || "-",
    },
    {
      accessorKey: "createdAt",
      header: "Dibuat Pada",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString("id-ID"),
    },
    {
      accessorKey: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex gap-2">
            <Link href={`/goods-receipts/${id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 text-blue-500" />
              </Button>
            </Link>
            <Link href={`/goods-receipts/${id}/update`}>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 text-orange-500" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteAsync(id)}
              disabled={deletePending}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];
   return (
    <Page 
      title="Buku Masuk" 
      description="Daftar penerimaan barang"
      headerAction={
        <Button asChild>
          <Link href="/goods-receipts/create">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Goods Receipt
          </Link>
        </Button>
      }
    >
      <DataTable
        columns={columns}
        source={data}
        isLoading={isLoading}
        isSearchable
        placeholderSearch="Cari supplier atau catatan..."
        pagination={pagination}
        handleChange={handleChange}
      />
    </Page>
  );
}
