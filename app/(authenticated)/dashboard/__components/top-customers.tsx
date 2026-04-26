"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/_components/ui/table";
import { Trophy, TrendingUp } from "lucide-react";
import { TopCustomer } from "../__hooks/use-get-dashboard-stats.query";
import Link from "next/link";

interface TopCustomersProps {
  customers: TopCustomer[];
  isLoading: boolean;
}

export const TopCustomers = ({ customers, isLoading }: TopCustomersProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Memuat data...</div>
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (index === 1) return <Trophy className="h-4 w-4 text-gray-400" />;
    if (index === 2) return <Trophy className="h-4 w-4 text-amber-600" />;
    return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Customer (Berdasarkan Quantity)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Belum ada data customer</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Total Order</TableHead>
                <TableHead className="text-right">Total Qty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, idx) => (
                <TableRow key={customer.customerId}>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {getRankIcon(idx)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/customers/${customer.customerId}`} className="hover:underline">
                      {customer.customerName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">{customer.totalOrders}x</TableCell>
                  <TableCell className="text-right font-medium">{customer.totalQuantity.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};