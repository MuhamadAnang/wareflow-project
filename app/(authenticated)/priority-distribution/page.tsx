"use client";

import Page from "@/app/_components/page";
import { useGetPriorityDistribution } from "./__hooks/use-get-priority.query";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { PriorityTable } from "./__components/priority-table";
import { Package, Trophy, TrendingUp, Calendar, Info } from "lucide-react";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import { Button } from "@/app/_components/ui/button";

export default function PriorityDistributionPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { data, isLoading, refetch, isFetching } = useGetPriorityDistribution();
  const priorities = data?.data?.priorities || [];
  const totalOrders = data?.data?.totalOrders || 0;
  const calculatedAt = data?.data?.calculatedAt;

  useEffect(() => {
    setBreadcrumbs([{ label: "Prioritas Distribusi" }]);
  }, [setBreadcrumbs]);

  const highestScore = priorities[0]?.score ? (priorities[0].score * 100).toFixed(1) : "0";

  return (
    <Page
      title="Prioritas Distribusi"
      description="Hasil perhitungan prioritas distribusi menggunakan metode TOPSIS berdasarkan kriteria yang telah ditentukan (AHP)."
      headerAction={
        <Button onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? "Menghitung..." : "Hitung Ulang"}
        </Button>
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Order</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
                <p className="text-xs text-muted-foreground mt-1">Pending (Confirmed/Partial)</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prioritas Tertinggi</p>
                <p className="text-lg font-semibold truncate max-w-[180px]">
                  {priorities[0]?.customerName || "-"}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Skor Tertinggi</p>
                <p className="text-2xl font-bold">{highestScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Terakhir Dihitung</p>
                <p className="text-sm font-medium">
                  {calculatedAt ? new Date(calculatedAt).toLocaleString("id-ID") : "-"}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Table Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle>Daftar Prioritas Pengiriman</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            Bobot: Stok(56%) | Urgensi(26%) | Status(12%) | Retur(6%)
          </div>
        </CardHeader>
        <CardContent>
          <PriorityTable priorities={priorities} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* Informasi Bobot Kriteria */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Informasi Bobot Kriteria (Hasil AHP)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-500" />
                <p className="font-semibold">C1 - Pemenuhan Stok</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">56%</p>
              <p className="text-xs text-muted-foreground">Benefit (semakin tinggi semakin baik)</p>
              <p className="text-xs">Persentase stok tersedia vs pesanan</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                <p className="font-semibold">C2 - Urgensi</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">26%</p>
              <p className="text-xs text-muted-foreground">Benefit (semakin tinggi semakin baik)</p>
              <p className="text-xs">Berdasarkan deadline pesanan (jika ada)</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-green-500" />
                <p className="font-semibold">C3 - Status Kontrak</p>
              </div>
              <p className="text-2xl font-bold text-green-600">12%</p>
              <p className="text-xs text-muted-foreground">Benefit (Kontrak=5, Langganan=3, Reguler=1)</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-red-500" />
                <p className="font-semibold">C4 - Riwayat Retur</p>
              </div>
              <p className="text-2xl font-bold text-red-600">6%</p>
              <p className="text-xs text-muted-foreground">Cost (semakin kecil semakin baik)</p>
              <p className="text-xs">Persentase retur dari total pesanan</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}