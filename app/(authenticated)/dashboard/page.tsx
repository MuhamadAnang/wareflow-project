"use client";

import Page from "@/app/_components/page";
import { useGetDashboardStats } from "./__hooks/use-get-dashboard-stats.query";
import { StatsCard } from "./__components/stats-card";
import { StockAlertList } from "./__components/stock-alert-list";
import { RecentOrders } from "./__components/recent-orders";
import { TopCustomers } from "./__components/top-customers";
import { PriorityPreview } from "./__components/priority-preview";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import {
  Package,
  Warehouse,
  AlertTriangle,
  Users,
  Building2,
  Clock,
  DollarSign,
  Truck,
} from "lucide-react";

export default function DashboardPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { data, isLoading, refetch } = useGetDashboardStats();
  const dashboardData = data?.data;

  useEffect(() => {
    setBreadcrumbs([{ label: "Dashboard" }]);
  }, [setBreadcrumbs]);

  const stats = dashboardData?.stats;

  return (
    <Page
      title="Dashboard"
      description="Selamat datang di Warehouse Management System. Pantau aktivitas gudang dan distribusi buku di sini."
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Buku"
          value={stats?.totalBooks || 0}
          icon={Package}
          description="Judul buku aktif"
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Total Stok"
          value={stats?.totalStock || 0}
          icon={Warehouse}
          description="Total eksemplar di gudang"
          iconColor="text-green-500"
        />
        <StatsCard
          title="Stok Menipis"
          value={stats?.lowStockItems || 0}
          icon={AlertTriangle}
          description="Buku dengan stok < 50"
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Total Customer"
          value={stats?.totalCustomers || 0}
          icon={Users}
          description="Customer aktif"
          iconColor="text-purple-500"
        />
        <StatsCard
          title="Total Supplier"
          value={stats?.totalSuppliers || 0}
          icon={Building2}
          description="Penerbit aktif"
          iconColor="text-cyan-500"
        />
        <StatsCard
          title="Order Pending"
          value={stats?.pendingOrders || 0}
          icon={Clock}
          description="Order confirmed/parsial"
          iconColor="text-yellow-500"
        />
        <StatsCard
          title="Nilai Pending"
          value={stats?.pendingOrdersValue || 0}
          icon={DollarSign}
          description="Total nilai order pending"
          iconColor="text-emerald-500"
        />
        <StatsCard
          title="Pengiriman Bulan Ini"
          value={stats?.shippedOrdersThisMonth || 0}
          icon={Truck}
          description="Jumlah pengiriman"
          iconColor="text-indigo-500"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StockAlertList items={dashboardData?.lowStock || []} isLoading={isLoading} />
        <PriorityPreview priorities={dashboardData?.priorityPreview || []} isLoading={isLoading} />
      </div>

      {/* Recent Orders & Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={dashboardData?.recentOrders || []} isLoading={isLoading} />
        <TopCustomers customers={dashboardData?.topCustomers || []} isLoading={isLoading} />
      </div>
    </Page>
  );
}