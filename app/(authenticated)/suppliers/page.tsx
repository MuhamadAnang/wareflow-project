"use client";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexSupplierQuerySchema } from "@/schemas/supplier.schema";
import { useGetSuppliersQuery } from "./__hooks/use-get-suppliers.query";
import { useDeleteSupplierMutation } from "./__hooks/use-delete-supplier.mutation";
import { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TSupplier } from "@/types/database";
import { toTitleCase } from "@/lib/utils";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { TSortOption } from "@/app/_components/data-table/sort";
import Page from "@/app/_components/page";
import DataTable from "@/app/_components/data-table";
import Link from "next/link";

export default function SuppliersPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(IndexSupplierQuerySchema);

  const { data, isLoading } = useGetSuppliersQuery({
    ...pagination,
    search,
    sort: filters.sort,
  });
  const { mutateAsync, isPending } = useDeleteSupplierMutation();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Suppliers",
      },
    ]);
  }, [setBreadcrumbs]);

  const columns: ColumnDef<TSupplier>[] = [
    {
      accessorKey: "name",
      header: "Nama Supplier ",
      cell: ({ row }) => {
        const supplier = row.original;
        return toTitleCase(supplier.name);
      },
    },
    {
      accessorKey: "phone",
      header: "No Handphone",
    },
    {
      accessorKey: "address",
      header: "Alamat",
    },
    {
      accessorKey: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const supplier = row.original;
        const id = supplier.id;

        return (
          <div className="flex gap-2">
            <Link href={`/suppliers/${id}`}>
              <Button variant={"outline"} disabled={isPending}>
                <Eye className="text-blue-500" />
              </Button>
            </Link>
            <Link href={`/suppliers/${id}/update`}>
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
      label: "Nama Supplier",
      options: [
        { direction: "asc", label: "A-Z" },
        { direction: "desc", label: "Z-A" },
      ],
    },
  ];

  return (
    <Page
    title="Suppliers"
    description="Kelola supplier Anda di sini. Anda dapat melihat, menambah, mengedit, dan menghapus informasi supplier sesuai kebutuhan."
      headerAction={
        <Link href={"/suppliers/create"}>
          <Button>
            <Plus /> Buat Suppliers Baru
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
        placeholderSearch="Cari dengan nama ..."
      />
    </Page>
  );
}
