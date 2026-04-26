import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";

export interface DashboardStats {
  totalBooks: number;
  totalStock: number;
  lowStockItems: number;
  totalCustomers: number;
  totalSuppliers: number;
  pendingOrders: number;
  pendingOrdersValue: number;
  shippedOrdersThisMonth: number;
  totalReturnsThisMonth: number;
}

export interface LowStockItem {
  id: number;
  code: string;
  name: string;
  currentStock: number;
  subjectName: string | null;
}

export interface RecentOrder {
  id: number;
  customerName: string;
  orderDate: string;
  deadline: string | null;
  status: string;
  totalItems: number;
  totalQuantity: number;
}

export interface TopCustomer {
  customerId: number;
  customerName: string;
  totalOrders: number;
  totalQuantity: number;
}

export interface PriorityPreviewItem {
  id: number;
  customerName: string;
  score: number;
  rank: number;
}

export interface DashboardData {
  stats: DashboardStats;
  lowStock: LowStockItem[];
  recentOrders: RecentOrder[];
  topCustomers: TopCustomer[];
  priorityPreview: PriorityPreviewItem[];
}

export const useGetDashboardStats = () => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<{ data: DashboardData }> => {
      return await api.get("/dashboard");
    },
    staleTime: 2 * 60 * 1000, // 2 menit
    refetchInterval: 5 * 60 * 1000, // Refresh setiap 5 menit
  });
};