"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { AlertTriangle, Package } from "lucide-react";
import { Progress } from "@/app/_components/ui/progress";
import { Badge } from "@/app/_components/ui/badge";
import { LowStockItem } from "../__hooks/use-get-dashboard-stats.query";
import Link from "next/link";

interface StockAlertListProps {
  items: LowStockItem[];
  isLoading: boolean;
}

export const StockAlertList = ({ items, isLoading }: StockAlertListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Peringatan Stok Menipis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Memuat data...</div>
        </CardContent>
      </Card>
    );
  }

  const getStockLevel = (stock: number) => {
    if (stock <= 10) return { label: "Kritis", color: "bg-red-500", percentage: 100 };
    if (stock <= 25) return { label: "Rendah", color: "bg-orange-500", percentage: 75 };
    return { label: "Menipis", color: "bg-yellow-500", percentage: 50 };
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Peringatan Stok Menipis
          </CardTitle>
          <Badge variant="outline">{items.length} Buku</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Semua buku memiliki stok yang cukup</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const stockLevel = getStockLevel(item.currentStock);
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Link href={`/books/${item.id}`} className="font-medium hover:underline text-sm">
                        {item.code}
                      </Link>
                      <p className="text-xs text-muted-foreground">{item.name}</p>
                      {item.subjectName && (
                        <p className="text-xs text-muted-foreground">Mapel: {item.subjectName}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className={stockLevel.color}>
                        {stockLevel.label}
                      </Badge>
                      <p className="text-sm font-bold mt-1">{item.currentStock} pcs</p>
                    </div>
                  </div>
                  <Progress value={stockLevel.percentage} className="h-2" />
                </div>
              );
            })}
            {items.length > 0 && (
              <div className="pt-2">
                <Link href="/books?stockStatus=low" className="text-xs text-primary hover:underline">
                  Lihat semua buku dengan stok menipis →
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};