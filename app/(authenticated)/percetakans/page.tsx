"use client";

import Page from "@/app/_components/page";
import { Button } from "@/app/_components/ui/button";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useGetPercetakansQuery } from "./__hooks/use-get-percetakans.query";
import DataTable from "@/app/_components/data-table";
import { TSortOption } from "@/app/_components/data-table/sort";
import { ColumnDef } from "@tanstack/react-table";
import { TPercetakan } from "@/types/database";
import { toTitleCase } from "@/lib/utils";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexPercetakanQuerySchema } from "@/schemas/percetakan.schema";
import { useEffect } from "react";
import { useDeletePercetakanMutation } from "./__hooks/use-delete-percetakan.mutation";

export default function PercetakansPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(IndexPercetakanQuerySchema);

  const { data, isLoading } = useGetPercetakansQuery({
    ...pagination,
    search,
    sort: filters.sort,
  });
  const { mutateAsync, isPending } = useDeletePercetakanMutation();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "percetakans",
      },
    ]);
  }, [setBreadcrumbs]);

  const columns: ColumnDef<TPercetakan>[] = [
    {
      accessorKey: "name",
      header: "Nama percetakan",
      cell: ({ row }) => {
        const percetakan = row.original;
        return toTitleCase(percetakan.name);
      },
    },
    {
      accessorKey: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const percetakan = row.original;
        const id = percetakan.id;

        return (
          <div className="flex gap-2">
            <Link href={`/percetakans/${id}`}>
              <Button variant={"outline"} disabled={isPending}>
                <Eye className="text-blue-500" />
              </Button>
            </Link>
            <Link href={`/percetakans/${id}/update`}>
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
      label: "percetakan Name",
      options: [
        { direction: "asc", label: "A-Z" },
        { direction: "desc", label: "Z-A" },
      ],
    },
  ];

  return (
    <Page
      title="percetakans"
      description="Kelola pelanggan Anda di sini. Anda dapat melihat, menambahkan, mengedit, dan menghapus informasi pelanggan sesuai kebutuhan."
      headerAction={
        <Link href={"/percetakans/create"}>
          <Button>
            <Plus /> Buat percetakan Baru
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
