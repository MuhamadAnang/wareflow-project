"use client";

import Page from "@/app/_components/page";
import { Button } from "@/app/_components/ui/button";
import { Eye, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useGetCustomerOrdersQuery } from "./__hooks/use-get-customer-orders.query";
import DataTable from "@/app/_components/data-table";
import { TSortOption } from "@/app/_components/data-table/sort";
import { ColumnDef } from "@tanstack/react-table";
import { TCustomerOrderListItem } from "@/types/database";
import { toTitleCase } from "@/lib/utils";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexCustomerOrderQuerySchema } from "@/schemas/customer-order.schema";
import { useEffect } from "react";
import { customerOrderStatusEnum } from "@/drizzle/schema";
import { Badge } from "@/app/_components/ui/badge";
import { useDeleteCustomerOrderMutation } from "./__hooks/use-delete-customer-order.mutation";

export default function CustomerOrdersPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(IndexCustomerOrderQuerySchema);

  const { data, isLoading } = useGetCustomerOrdersQuery({
    ...pagination,
    search,
    sort: filters.sort,
    status: filters.status,
  });
  const { mutateAsync, isPending } = useDeleteCustomerOrderMutation();

  useEffect(() => {
    setBreadcrumbs([{ label: "Customer Orders" }]);
  }, [setBreadcrumbs]);

  const columns: ColumnDef<TCustomerOrderListItem>[] = [
    { accessorKey: "id", header: "Order ID" },
    { accessorKey: "customerName", header: "Customer" },
    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: ({ row }) => new Date(row.original.orderDate).toLocaleDateString(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variant = status === "CANCELLED" ? "destructive" : status === "DRAFT" ? "secondary" : "default";
        return <Badge variant={variant}>{toTitleCase(status)}</Badge>;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`/customer-orders/${row.original.id}`}>
            <Button variant="outline" size="icon" disabled={isPending}>
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={() => mutateAsync(row.original.id)}
            disabled={isPending}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const sortOptions: TSortOption[] = [
    {
      key: "orderDate",
      label: "Order Date",
      options: [
        { direction: "asc", label: "Oldest first" },
        { direction: "desc", label: "Newest first" },
      ],
    },
    {
      key: "status",
      label: "Status",
      options: [
        { direction: "asc", label: "A-Z" },
        { direction: "desc", label: "Z-A" },
      ],
    },
  ];

  return (
    <Page
      title="Customer Orders"
      description="Manage customer orders, track status, and process shipments."
      headerAction={
        <Link href="/customer-orders/create">
          <Button>
            <Plus /> New Order
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
        placeholderSearch="Search by customer name..."
        filterComponents={[
          {
            type: "Select",
            name: "status",
            label: "Status",
            options: customerOrderStatusEnum.enumValues.map((v) => ({ label: toTitleCase(v), value: v })),
            value: filters.status,
          },
        ]}
      />
    </Page>
  );
}