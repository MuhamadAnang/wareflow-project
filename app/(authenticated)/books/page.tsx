"use client";

import Page from "@/app/_components/page";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import DataTable from "@/app/_components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { TBookListItem } from "@/types/database";
import { toTitleCase } from "@/lib/utils";
import { useDeleteBookMutation } from "./__hooks/use-delete-book.mutation";
import { useGetBooksQuery } from "./__hooks/use-get-book.query";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexBookQuerySchema } from "@/schemas/book.schema";
export default function BooksPage() {
  const { handleChange, pagination, filters, search } = useFilters(IndexBookQuerySchema);

  const { data, isLoading } = useGetBooksQuery({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search,
    sort: filters.sort,
    subjectId: filters.subjectId,
    semester: filters.semester,
  });

  const { mutateAsync: deleteBook, isPending: isDeleting } = useDeleteBookMutation();

  const columns: ColumnDef<TBookListItem>[] = [
    { accessorKey: "code", header: "Kode Buku" },
    { 
      accessorKey: "name", 
      header: "Nama Buku",
      cell: ({ row }) => row.original.name || row.original.displayTitle 
    },
    {
      accessorKey: "pages",
      header: "Halaman",
      cell: ({ row }) => row.original.pages ?? "-",
    },
    {
      accessorKey: "productionYear",
      header: "Tahun Terbit",
      cell: ({ row }) => row.original.productionYear ?? "-",
    },
    { 
      accessorKey: "currentStock", 
      header: "Stok Saat Ini",
      cell: ({ row }) => <strong>{row.original.currentStock ?? 0}</strong>
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex gap-2">
            <Link href={`/books/${id}`}>
              <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
            </Link>
            <Link href={`/books/${id}/update`}>
              <Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button>
            </Link>
            <Button variant="outline" size="icon" className="text-destructive"
              onClick={() => confirm("Hapus buku ini?") && deleteBook(id)}
              disabled={isDeleting}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Page
      title="Daftar Buku"
      description="Kelola identitas buku lengkap"
      headerAction={
        <Link href="/books/create">
          <Button><Plus className="mr-2 h-4 w-4" /> Tambah Buku Baru</Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        source={data}
        handleChange={handleChange}
        search={search}
        isLoading={isLoading}
        pagination={pagination}
        isSearchable
        placeholderSearch="Cari kode atau nama buku..."
        sortDefaultValue={filters.sort}
      />
    </Page>
  );
}