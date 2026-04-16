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
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexBookQuerySchema } from "@/schemas/book.schema";
import { useEffect } from "react";
import { semesterEnum } from "@/drizzle/schema";
import { useDeleteBookMutation } from "./__hooks/use-delete-book.mutation";
import { useGetBooksQuery } from "./__hooks/use-get-book.query";

export default function BooksPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(IndexBookQuerySchema);

  const queryParamsForApi = {
    page: 1,                  // paksa 1
    pageSize: 20,             // paksa 20
    search: search,
    sort: filters.sort,
    bookTitleId: filters.bookTitleId,
    supplierId: filters.supplierId,
    semester: filters.semester,
  };

  const { data, isLoading } = useGetBooksQuery(queryParamsForApi);

  const { mutateAsync: deleteBook, isPending: isDeleting } = useDeleteBookMutation();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Books", 
      },
    ]);
  }, [setBreadcrumbs]);

  const columns: ColumnDef<TBookListItem>[] = [
    {
      accessorKey: "code",
      header: "Kode Buku",
      cell: ({ row }) => row.original.code,
    },
    {
      accessorKey: "displayTitle",
      header: "Judul Buku",
      cell: ({ row }) => row.original.displayTitle || "Tidak Diketahui",
    },
    {
      accessorKey: "supplierName",
      header: "Penerbit",
      cell: ({ row }) => row.original.supplierName || "-",
    },
    {
      accessorKey: "semester",
      header: "Semester",
      cell: ({ row }) => (
        <Badge variant="outline">
          {toTitleCase(row.original.semester)}
        </Badge>
      ),
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
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const book = row.original;
        const id = book.id;

        return (
          <div className="flex gap-2">
            <Link href={`/books/${id}`}>
              <Button variant="outline" size="icon" disabled={isDeleting}>
                <Eye className="h-4 w-4 text-blue-500" />
              </Button>
            </Link>
            <Link href={`/books/${id}/update`}>
              <Button variant="outline" size="icon" disabled={isDeleting}>
                <Pencil className="h-4 w-4 text-orange-500" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="text-destructive"
              onClick={async () => {
                if (confirm("Yakin ingin hapus buku ini? (soft delete)")) {
                  await deleteBook(id);
                }
              }}
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
  console.log(useFilters(IndexBookQuerySchema).pagination);
  return (
    
    <Page
      title="Daftar Buku"
      description="Kelola varian buku fisik di sini. Tambah, edit, hapus, dan lihat detail buku."
      headerAction={
        <Link href="/books/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tambah Buku Baru
          </Button>
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
        placeholderSearch="Cari kode atau judul buku..."
        sortDefaultValue={filters.sort}
        filterComponents={[
          {
            type: "Select",
            name: "semester",
            label: "Semester",
            options: semesterEnum.enumValues.map((val) => ({
              label: toTitleCase(val),
              value: val,
            })),
            value: filters.semester,
          },
          // Tambah filter bookTitleId & supplierId kalau sudah punya query master
          // Misal:
          // {
          //   type: "AsyncSelect",
          //   name: "bookTitleId",
          //   label: "Judul Buku",
          //   loadOptions: async (input) => { ... fetch book titles ... }
          // },
        ]}
      />
    </Page>
  );
}