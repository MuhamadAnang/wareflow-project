"use client";

import Page from "@/app/_components/page";
import { Button } from "@/app/_components/ui/button";
import { Eye, Plus, Package } from "lucide-react";
import Link from "next/link";
import { useGetGoodsOutQuery } from "./__hooks/use-get-goods-out.query";
import DataTable from "@/app/_components/data-table";
import { TSortOption } from "@/app/_components/data-table/sort";
import { ColumnDef } from "@tanstack/react-table";
import { TGoodsOutListItem } from "@/types/database";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexGoodsOutQuerySchema } from "@/schemas/goods-out.schema";
import { useEffect } from "react";
export default function GoodsOutPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(IndexGoodsOutQuerySchema);
  const { data, isLoading } = useGetGoodsOutQuery({
    ...pagination,
    search,
    sort: filters.sort,
  });

  useEffect(() => {
    setBreadcrumbs([{ label: "Pengiriman Barang" }]);
  }, [setBreadcrumbs]);

  const columns: ColumnDef<TGoodsOutListItem>[] = [
    {
      accessorKey: "id",
      header: "ID Pengiriman",
      cell: ({ row }) => `#${row.original.id}`,
    },
    {
      accessorKey: "customerName",
      header: "Customer",
    },
    {
      accessorKey: "customerInstitution",
      header: "Instansi",
    },
    {
      accessorKey: "customerAddress",
      header: "Alamat Customer",
      cell: ({ row }) => row.original.customerAddress || "-",
    },
    {
      accessorKey: "shippedDate",
      header: "Tanggal Kirim",
      cell: ({ row }) => new Date(row.original.shippedDate).toLocaleDateString(),
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
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/goods-out/${row.original.id}`}>
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  const sortOptions: TSortOption[] = [
    {
      key: "shippedDate",
      label: "Tanggal Kirim",
      options: [
        { direction: "asc", label: "Terlama" },
        { direction: "desc", label: "Terbaru" },
      ],
    },
  ];

  return (
    <Page
      title="Pengiriman Barang"
      description="Kelola pengiriman barang ke customer. Lihat riwayat pengiriman dan buat pengiriman baru."
      headerAction={
        <Link href="/goods-out/create">
          <Button>
            <Plus /> Buat Pengiriman
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