"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useGetBookTitle } from "./__hooks/use-get-book-title.query";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { convertUtcToLocalTime, toTitleCase } from "@/lib/utils";

export default function BookTitleDetailPage() {
  const params = useParams();

  const { data, isLoading } = useGetBookTitle(Number(params.id));

  return (
    <Page
      isLoading={isLoading}
      title="BookTitle Detail"
      description="Detailed information about the bookTitle, including contact details, order history, and any relevant notes or interactions. Use this page to get a comprehensive view of the bookTitle's profile and manage their information effectively."
    >
      <Card className="gap-3 shadow-none">
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="w-auto bg-background">Judul Buku</TableCell>
                <TableCell className="w-full">{data?.data.displayTitle || "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Subject</TableCell>
                <TableCell className="w-full">{data?.data.subjectName || "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Grade</TableCell>
                <TableCell className="w-full">{data?.data.grade}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Jenjang</TableCell>
                <TableCell className="w-full">
                  <Badge>{data && toTitleCase(data?.data.level)}</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Kurikulum</TableCell>
                <TableCell className="w-full">
                  <Badge>{data && toTitleCase(data?.data.curriculum)}</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Created At</TableCell>
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
                <TableCell className="w-auto min-w-50 bg-background">Last Updated At</TableCell>
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
