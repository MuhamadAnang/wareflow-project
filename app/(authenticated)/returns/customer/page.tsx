"use client";

import Page from "@/app/_components/page";
import { Button } from "@/app/_components/ui/button";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useGetCustomerReturnsQuery } from "./__hooks/use-get-customer-returns.query";
import DataTable from "@/app/_components/data-table";
import { TSortOption } from "@/app/_components/data-table/sort";
import { ColumnDef } from "@tanstack/react-table";
import { TCustomerReturnListItem } from "@/types/database";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexCustomerReturnQuerySchema } from "@/schemas/customer-return.schema";
import { useEffect } from "react";

export default function CustomerReturnsPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(IndexCustomerReturnQuerySchema);
  const { data, isLoading } = useGetCustomerReturnsQuery({
    ...pagination,
    search,
    sort: filters.sort,
  });

  useEffect(() => {
    setBreadcrumbs([{ label: "Retur Customer" }]);
  }, [setBreadcrumbs]);

  const columns: ColumnDef<TCustomerReturnListItem>[] = [
    {
      accessorKey: "id",
      header: "ID Retur",
      cell: ({ row }) => `#${row.original.id}`,
    },
    {
      accessorKey: "customerName",
      header: "Customer",
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
        <Link href={`/returns/customer/${row.original.id}`}>
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
      title="Retur Customer"
      description="Kelola retur barang dari customer. Stok akan bertambah saat retur dibuat."
      headerAction={
        <Link href="/returns/customer/create">
          <Button>
            <Plus /> Buat Retur Customer
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
        placeholderSearch="Cari berdasarkan nama customer..."
      />
    </Page>
  );
}