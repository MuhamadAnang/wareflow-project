"use client";

import Page from "@/app/_components/page";
import { Button } from "@/app/_components/ui/button";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useGetBookTitlesQuery } from "./__hooks/use-get-book-titles.query";
import DataTable from "@/app/_components/data-table";
import { TSortOption } from "@/app/_components/data-table/sort";
import { ColumnDef } from "@tanstack/react-table";
import { TBookTitle } from "@/types/database";
import { toTitleCase } from "@/lib/utils";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexBookTitleQuerySchema } from "@/schemas/book-title.schema";
import { useEffect } from "react";
import { bookLevelEnum } from "@/drizzle/schema";
import { useDeleteBookTitleMutation } from "./__hooks/use-delete-book-title.mutation";

export default function BookTitlesPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(IndexBookTitleQuerySchema);

  const { data, isLoading } = useGetBookTitlesQuery({
    ...pagination,
    search,
    sort: filters.sort,
    level: filters.level,
  });
  const { mutateAsync, isPending } = useDeleteBookTitleMutation();
  type TBookTitleRow = TBookTitle & {
    subjectName: string;
    displayTitle: string;
  };
  useEffect(() => {
    setBreadcrumbs([
      {
        label: "BookTitles",
      },
    ]);
  }, [setBreadcrumbs]);

  const columns: ColumnDef<TBookTitleRow>[] = [
    {
      accessorKey: "displayTitle",
      header: "BookTitle Name",
    },
    {
      accessorKey: "subjectName",
      header: "Subject",
    },
    {
      accessorKey: "grade",
      header: "Grade",
    },
    {
      accessorKey: "level",
      header: "Jenjang",
    },
    {
      accessorKey: "curriculum",
      header: "Curriculum",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const bookTitle = row.original;
        const id = bookTitle.id;

        return (
          <div className="flex gap-2">
            <Link href={`/book-titles/${id}`}>
              <Button variant={"outline"} disabled={isPending}>
                <Eye className="text-blue-500" />
              </Button>
            </Link>
            <Link href={`/book-titles/${id}/update`}>
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
      label: "BookTitle Name",
      options: [
        { direction: "asc", label: "A-Z" },
        { direction: "desc", label: "Z-A" },
      ],
    },
  ];

  return (
    <Page
      title="BookTitles"
      description="Manage your bookTitles here. You can view, add, edit, and delete bookTitle information as needed."
      headerAction={
        <Link href={"/book-titles/create"}>
          <Button>
            <Plus /> Create New BookTitle
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
        placeholderSearch="Search with name ..."
        filterComponents={[
          {
            type: "Select",
            name: "level",
            label: "Level",
            options: bookLevelEnum.enumValues.map((value) => ({
              label: toTitleCase(value),
              value,
            })),
            value: filters.level,
          },
        ]}
      />
    </Page>
  );
}
