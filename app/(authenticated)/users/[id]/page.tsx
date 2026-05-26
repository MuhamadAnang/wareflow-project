"use client";

import Page from "@/app/_components/page";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { useParams } from "next/navigation";
import { useGetClerkUserByIdQuery } from "./_hooks/use-queries";
import { Badge } from "@/app/_components/ui/badge";
import { format, fromUnixTime } from "date-fns";
import { ApproveButton } from "./_components/approve.button";
import { RejectButton } from "./_components/reject.button";
import { SuspendButton } from "./_components/suspend.button";
import { UnsuspendButton } from "./_components/unsuspend.button";

export default function UserPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetClerkUserByIdQuery(id);

  const user = data?.data;

  const primaryEmailAddress =
    user?.emailAddresses?.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress ??
    null;
  const googleEmailAddress =
    user?.externalAccounts?.find((account) => account.provider === "oauth_google")?.emailAddress ??
    null;
  const isAllowedToLogin = user?.publicMetadata?.isAllowed ?? null;
  const isNewUser = Object.keys(user?.publicMetadata ?? {}).length === 0;
  const isBanned = user?.banned;

  return (
    <Page
      isLoading={isLoading}
      title="Detail Pengguna"
      description="Lihat detail informasi pengguna di sini."
      headerAction={
        <div className="flex gap-3">
          {!isNewUser && !isBanned && <SuspendButton />}
          {isNewUser && (
            <>
              <RejectButton />
              <ApproveButton />
            </>
          )}
          {isBanned && <UnsuspendButton />}
        </div>
      }
    >
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">User Id</TableCell>
            <TableCell>{user?.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Nama Lengkap</TableCell>
            <TableCell>
              {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Username</TableCell>
            <TableCell>{user?.username ? user?.username : "-"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Email Utama</TableCell>
            <TableCell>{primaryEmailAddress || "-"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Email Google</TableCell>
            <TableCell>{googleEmailAddress || "-"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Status</TableCell>
            <TableCell>
              {!isBanned && isAllowedToLogin && <Badge variant="success">Disetujui</Badge>}
              {!isBanned && !isAllowedToLogin && (
                <Badge variant="warning">Menunggu Persetujuan</Badge>
              )}
              {isBanned && (
                <Badge variant="destructive" className="ml-2">
                  Diblokir
                </Badge>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Dibuat Pada</TableCell>
            <TableCell>
              {user?.createdAt
                ? format(fromUnixTime(user?.createdAt), "dd MMM yyyy HH:mm:ss")
                : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Terakhir Diperbarui</TableCell>
            <TableCell>
              {user?.updatedAt
                ? format(fromUnixTime(user?.updatedAt), "dd MMM yyyy HH:mm:ss")
                : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Terakhir Login</TableCell>
            <TableCell>
              {user?.lastSignInAt
                ? format(fromUnixTime(user?.lastSignInAt), "dd MMM yyyy HH:mm:ss")
                : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Terakhir Aktif</TableCell>
            <TableCell>
              {user?.lastActiveAt
                ? format(fromUnixTime(user?.lastActiveAt), "dd MMM yyyy HH:mm:ss")
                : "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Page>
  );
}
