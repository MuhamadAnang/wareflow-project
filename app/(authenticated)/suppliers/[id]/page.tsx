"use client";

import { useParams } from "next/navigation";
import { useGetSupplier } from "./__hooks/use-get-supplier.query";
import Page from "@/app/_components/page";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { convertUtcToLocalTime } from "@/lib/utils";

export default function SupplierDetailPage() {
    const params = useParams();
  
    const { data, isLoading } = useGetSupplier(Number(params.id));
  
    return (
      <Page
        isLoading={isLoading}
        title="Supplier Detail"
        description="Informasi detail tentang Supplier, termasuk detail kontak, riwayat pesanan, dan catatan atau interaksi yang relevan. Gunakan halaman ini untuk mendapatkan gambaran komprehensif tentang profil Supplier dan mengelola informasi mereka secara efektif."
      >
        <Card className="gap-3 shadow-none">
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-auto bg-background">Supplier Id</TableCell>
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
                  <TableCell className="w-auto bg-background">Dibuat Pada</TableCell>
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
  