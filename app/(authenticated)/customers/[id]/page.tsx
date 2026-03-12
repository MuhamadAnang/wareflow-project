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
      description="Detailed information about the customer, including contact details, order history, and any relevant notes or interactions. Use this page to get a comprehensive view of the customer's profile and manage their information effectively."
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
                <TableCell className="w-auto bg-background">Name</TableCell>
                <TableCell className="w-full">{data?.data.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Phone</TableCell>
                <TableCell className="w-full">{data?.data.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Address</TableCell>
                <TableCell className="w-full">{data?.data.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">School</TableCell>
                <TableCell className="w-full">{data?.data.school}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-auto bg-background">Status</TableCell>
                <TableCell className="w-full">
                  <Badge>{data && toTitleCase(data?.data.status)}</Badge>
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
