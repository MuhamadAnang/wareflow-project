"use client";

import Page from "@/app/_components/page";
import { useGetClerkUsersQuery } from "./_hooks/use-queries";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexQueryParams } from "@/types/query-params";
import DataTable from "@/app/_components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { TClerkUser } from "@/types/database";
import Image from "next/image";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Eye, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { DeleteUserButton } from "./_components/delete-user.button";
import { useAuth } from "@clerk/nextjs";

export default function UsersPage() {
  const { handleChange, pagination } = useFilters(IndexQueryParams);
  const { userId } = useAuth();

  const { data, isLoading } = useGetClerkUsersQuery({
    ...pagination,
  });

  const columns: ColumnDef<TClerkUser>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      id: "fullName",
      header: "Nama Lengkap",
      cell: ({ row }) => {
        const hasImage = row.original.hasImage;
        const fullName = `${row.original.firstName} ${row.original.lastName}`;

        return (
          <div className="flex gap-2 items-center">
            {hasImage && (
              <Image
                src={row.original.imageUrl}
                alt={`${row.original.firstName} ${row.original.lastName}`}
                width={30}
                height={30}
                className="rounded-full mr-2"
              />
            )}
            {fullName || "No Name"}
          </div>
        );
      },
    },
    {
      accessorKey: "emailAddresses",
      header: "Email",
      cell: ({ row }) => {
        const email = row.original.emailAddresses[0]?.emailAddress;
        return email || <i>Not set</i>;
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const isEligible = row.original.publicMetadata?.isAllowed;
        const isBanned = row.original.banned;
        return isBanned ? (
          <Badge variant="destructive">Banned</Badge>
        ) : isEligible ? (
          <Badge>Allowed</Badge>
        ) : (
          <Badge variant="destructive">Need Approval</Badge>
        );
      },
    },
    {
      id: "action",
      header: "Aksi",
      cell: ({ row }) => {
        return (
          row.original.id !== userId && (
            <div className="flex gap-2">
              <Link href={`/users/${row.original.id}`}>
                <Button variant={"outline"}>
                  <Eye className="text-orange-500" />
                </Button>
              </Link>
              <Link href={`/users/${row.original.id}/update`}>
                <Button variant={"outline"}>
                  <Pencil className="text-green-500" />
                </Button>
              </Link>
              <DeleteUserButton id={row.original.id} />
            </div>
          )
        );
      },
    },
  ];

  return (
    <Page
      isLoading={isLoading}
      title="Pengguna"
      headerAction={
        <Link href="/users/create">
          <Button>
            <Plus className="mr-2" />
            Tambah Pengguna
          </Button>
        </Link>
      }
      description="Kelola pengguna yang memiliki akses ke sistem. Tambahkan, edit, atau hapus pengguna sesuai kebutuhan untuk memastikan keamanan dan efisiensi operasional."
    >
      <DataTable
        handleChange={handleChange}
        pagination={pagination}
        columns={columns}
        source={data}
      />
    </Page>
  );
}
