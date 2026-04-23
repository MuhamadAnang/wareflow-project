"use client";

import Page from "@/app/_components/page";
import { Button } from "@/app/_components/ui/button";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useGetSupplierReturnsQuery } from "./__hooks/use-get-supplier-returns.query";
import DataTable from "@/app/_components/data-table";
import { TSortOption } from "@/app/_components/data-table/sort";
import { ColumnDef } from "@tanstack/react-table";
import { TSupplierReturnListItem } from "@/types/database";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexSupplierReturnQuerySchema } from "@/schemas/supplier-return.schema";
import { useEffect } from "react";

export default function SupplierReturnsPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(IndexSupplierReturnQuerySchema);
  const { data, isLoading } = useGetSupplierReturnsQuery({
    ...pagination,
    search,
    sort: filters.sort,
  });

  useEffect(() => {
    setBreadcrumbs([{ label: "Retur Supplier" }]);
  }, [setBreadcrumbs]);

  const columns: ColumnDef<TSupplierReturnListItem>[] = [
    {
      accessorKey: "id",
      header: "ID Retur",
      cell: ({ row }) => `#${row.original.id}`,
    },
    {
      accessorKey: "supplierName",
      header: "Supplier",
    },
    {
      accessorKey: "returnDate",
      header: "Tanggal Retur",
      cell: ({ row }) => new Date(row.original.returnDate).toLocaleDateString(),
    },
    {
      accessorKey: "totalItems",
      header: "Jumlah Item",
    },
    {
      accessorKey: "totalQuantity",
      header: "Total Qty",
    },
    {
      accessorKey: "reason",
      header: "Alasan",
      cell: ({ row }) => row.original.reason || "-",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/returns/supplier/${row.original.id}`}>
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  const sortOptions: TSortOption[] = [
    {
      key: "returnDate",
      label: "Tanggal Retur",
      options: [
        { direction: "asc", label: "Terlama" },
        { direction: "desc", label: "Terbaru" },
      ],
    },
  ];

  return (
    <Page
      title="Retur Supplier"
      description="Kelola retur barang ke supplier. Stok akan berkurang saat retur dibuat."
      headerAction={
        <Link href="/returns/supplier/create">
          <Button>
            <Plus /> Buat Retur Supplier
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
        sortOptions={sortOptions}
        isSearchable
        sortDefaultValue={filters.sort}
        placeholderSearch="Cari berdasarkan nama supplier..."
      />
    </Page>
  );
}