"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useGetCustomer } from "./__hooks/use-get-customer.query";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { convertUtcToLocalTime, toTitleCase } from "@/lib/utils";

export default function CustomerDetailPage() {
  const params = useParams();

  const { data, isLoading } = useGetCustomer(Number(params.id));

  return (
    <Page
      isLoading={isLoading}
      title="Customer Detail"
      description="Informasi detail tentang pelanggan, termasuk detail kontak, riwayat pesanan, dan catatan atau interaksi yang relevan. Gunakan halaman ini untuk mendapatkan gambaran komprehensif tentang profil pelanggan dan mengelola informasi mereka secara efektif."
    >
      <Card className="gap-3 shadow-none">
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="w-auto bg-background">Customer Id</TableCell>
                <TableCell className="w-full">{data?.data.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Nama</TableCell>
                <TableCell className="w-full">{data?.data.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">No Handphone</TableCell>
                <TableCell className="w-full">{data?.data.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Alamat</TableCell>
                <TableCell className="w-full">{data?.data.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Intansi/Sekolah</TableCell>
                <TableCell className="w-full">{data?.data.institution}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Status Pelanggan</TableCell>
                <TableCell className="w-full">
                  <Badge>{data && toTitleCase(data?.data.status)}</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Dibuat pada</TableCell>
                <TableCell className="w-full">
                  {data ? (
                    <>
                      {convertUtcToLocalTime({
                        utcDateStr: data?.data.createdAt.toString(),
                        format: "PPpp",
                      })}
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto min-w-50 bg-background">Terakhir Diperbarui</TableCell>
                <TableCell className="w-full">
                  {data ? (
                    <>
                      {convertUtcToLocalTime({
                        utcDateStr: data?.data.updatedAt.toString(),
                        format: "PPpp",
                      })}
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Page>
  );
}
