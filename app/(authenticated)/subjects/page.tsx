"use client";

import Page from "@/app/_components/page";
import { Button } from "@/app/_components/ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useGetSubjectsQuery } from "./__hooks/use-get-subjects.query";
import DataTable from "@/app/_components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { TSubject } from "@/types/database";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexSubjectQuerySchema } from "@/schemas/subject.schema";
import { useEffect } from "react";
import { useDeleteSubjectMutation } from "./__hooks/use-delete-subject.mutation";
import { TSortOption } from "@/app/_components/data-table/sort";

export default function SubjectsPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(IndexSubjectQuerySchema);

  const { data, isLoading } = useGetSubjectsQuery({
    ...pagination,
    search,
    sort: filters.sort,
  });

  const { mutateAsync, isPending } = useDeleteSubjectMutation();

  useEffect(() => {
    setBreadcrumbs([{ label: "Mata Pelajaran" }]);
  }, [setBreadcrumbs]);

  const columns: ColumnDef<TSubject>[] = [
    {
      accessorKey: "name",
      header: "Nama Mata Pelajaran",
    },
    {
      accessorKey: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const subject = row.original;
        const id = subject.id;

        return (
          <div className="flex gap-2">
            <Link href={`/subjects/${id}/update`}>
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
      label: "Subject Name",
      options: [
        { direction: "asc", label: "A-Z" },
        { direction: "desc", label: "Z-A" },
      ],
    },
  ];

  return (
    <Page
      title="Mata Pelajaran"
      description="Kelola daftar mata pelajaran yang digunakan untuk mengklasifikasikan buku."
      headerAction={
        <Link href="/subjects/create">
          <Button>
            <Plus /> Tambah Mata Pelajaran
          </Button>
        </Link>
      }
    >
      <DataTable
        sortOptions={sortOptions}
        sortDefaultValue={filters.sort}
        columns={columns}
        source={data}
        handleChange={handleChange}
        search={search}
        isLoading={isLoading}
        pagination={pagination}
        isSearchable
        placeholderSearch="Cari nama mata pelajaran..."
      />
    </Page>
  );
}
