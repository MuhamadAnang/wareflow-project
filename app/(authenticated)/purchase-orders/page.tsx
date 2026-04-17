"use client";

import Page from "@/app/_components/page";
import { Button } from "@/app/_components/ui/button";
import { Plus, Eye, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useGetPurchaseOrdersQuery } from "./__hooks/use-get-purchase-orders.query";
import DataTable from "@/app/_components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import { convertUtcToLocalTime } from "@/lib/utils";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexPurchaseOrderQuerySchema } from "@/schemas/purchase-order.schema";
import { TPurchaseOrderWithSupplier } from "@/types/database";
import { useDeletePurchaseOrderMutation } from "./__hooks/use-delete-purchase-order.mutation";
import { TSortOption } from "@/app/_components/data-table/sort";

export default function PurchaseOrdersPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(IndexPurchaseOrderQuerySchema);

  const { data, isLoading } = useGetPurchaseOrdersQuery({
    ...pagination,
    search,
    sort: filters.sort,
  });
  const { mutateAsync, isPending } = useDeletePurchaseOrderMutation();

  useEffect(() => {
    setBreadcrumbs([{ label: "Purchase Orders" }]);
  }, [setBreadcrumbs]);

  const columns: ColumnDef<TPurchaseOrderWithSupplier>[] = [
    {
      accessorKey: "id",
      header: "PO ID",
    },
    {
      accessorKey: "supplierName",
      header: "Supplier",
    },
    {
      accessorKey: "orderDate",
      header: "Tanggal Order",
      cell: ({ row }) =>
        convertUtcToLocalTime({
          utcDateStr: row.original.orderDate,
          format: "dd MMM yyyy",
        }),
    },
    {
      accessorKey: "note",
      header: "Catatan",
      cell: ({ row }) => row.original.note || "-",
    },
    // {
    //   accessorKey: "createdAt",
    //   header: "Dibuat Pada",
    //   cell: ({ row }) => convertUtcToLocalTime({
    //     utcDateStr: row.original.createdAt.toISOString()
    //   }),
    // },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const customer = row.original;
        const id = customer.id;

        return (
          <div className="flex gap-2">
            <Link href={`/purchase-orders/${id}`}>
              <Button variant={"outline"} disabled={isPending}>
                <Eye className="text-blue-500" />
              </Button>
            </Link>
            <Link href={`/purchase-orders/${id}/update`}>
              <Button variant={"outline"} disabled={isPending}>
                <Pencil className="text-orange-500" />
              </Button>
            </Link>
            <Button
              onClick={async () => {
                await mutateAsync(id);
              }}
              variant={"outline"}
              className="text-destructive"
              isLoading={isPending}
            >
              <Trash />
            </Button>
          </div>
        );
      },
    },
  ];

  const sortOptions: TSortOption[] = [
    {
      key: "name",
      label: "Customer Name",
      options: [
        { direction: "asc", label: "A-Z" },
        { direction: "desc", label: "Z-A" },
      ],
    },
  ];

  return (
    <Page
      title="Belanja Buku"
      description="Daftar semua Belanja Buku ke supplier"
      headerAction={
        <Link href="/purchase-orders/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tambah Belanja Baru
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
        placeholderSearch="Cari dengan nama supplier ..."
      />
    </Page>
  );
}
