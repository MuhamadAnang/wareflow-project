"use client";

import Page from "@/app/_components/page";
import { Button } from "@/app/_components/ui/button";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useGetCustomersQuery } from "./__hooks/use-get-customers.query";
import DataTable from "@/app/_components/data-table";
import { TSortOption } from "@/app/_components/data-table/sort";
import { ColumnDef } from "@tanstack/react-table";
import { TCustomer } from "@/types/database";
import { toTitleCase } from "@/lib/utils";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexCustomerQuerySchema } from "@/schemas/customer.schema";
import { useEffect } from "react";
import { customerStatusEnum } from "@/drizzle/schema";
import { Badge } from "@/app/_components/ui/badge";
import { toast } from "sonner";
import { useDeleteCustomerMutation } from "./__hooks/use-delete-customer.mutation";

export default function CustomersPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(IndexCustomerQuerySchema);

  const { data, isLoading } = useGetCustomersQuery({
    ...pagination,
    search,
    sort: filters.sort,
    status: filters.status,
  });
  const { mutateAsync, isPending } = useDeleteCustomerMutation();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Customers",
      },
    ]);
  }, [setBreadcrumbs]);

  const columns: ColumnDef<TCustomer>[] = [
    {
      accessorKey: "name",
      header: "Customer Name",
      cell: ({ row }) => {
        const customer = row.original;
        return toTitleCase(customer.name);
      },
    },
    {
      accessorKey: "school",
      header: "School",
    },
    {
      accessorKey: "status",
      cell: ({ row }) => {
        const customer = row.original;
        return <Badge>{toTitleCase(customer.status)}</Badge>;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const customer = row.original;
        const id = customer.id;

        return (
          <div className="flex gap-2">
            <Link href={`/customers/${id}`}>
              <Button variant={"outline"} disabled={isPending}>
                <Eye className="text-blue-500" />
              </Button>
            </Link>
            <Link href={`/customers/${id}/update`}>
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
      title="Customers"
      description="Manage your customers here. You can view, add, edit, and delete customer information as needed."
      headerAction={
        <Link href={"/customers/create"}>
          <Button>
            <Plus /> Create New Customer
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
            name: "status",
            label: "Status",
            options: customerStatusEnum.enumValues.map((value) => ({
              label: toTitleCase(value),
              value,
            })),
            value: filters.status,
          },
        ]}
      />
    </Page>
  );
}
