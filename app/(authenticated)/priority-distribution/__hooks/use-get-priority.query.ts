import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";

export interface PriorityResult {
  id: number;
  customerName: string;
  customerInstitution: string;
  score: number;
  rank: number;
  criteria: {
    stockFulfillment: number;
    urgency: number;
    contractStatus: number;
    returnRate: number;
  };
  deadline?: string | null;
  orderDate?: string;
  orderDetails?: unknown;
}

export interface PendingPriorityOrder {
  orderId: number;
  customerId: number;
  customerName: string;
  customerInstitution: string;
  stockFulfillment: number;
  urgency: number;
  contractStatus: number;
  returnRate: number;
  orderItems: {
    id: number;
    bookId: number;
    quantity: number;
    price: string;
    bookCode: string;
    bookName: string;
  }[];
  deadline: string | null;
  orderDate: string;
}

export interface PriorityResponse {
  priorities: PriorityResult[];
  totalOrders: number;
  selectedOrderIds: number[];
  calculatedAt: string;
}

export const useGetPriorityDistribution = (selectedOrderIds: number[] = []) => {
  const api = useAuthenticatedClient();
  const orderIds = [...selectedOrderIds].sort((a, b) => a - b);

  return useQuery({
    queryKey: ["priority-distribution", orderIds],
    queryFn: async (): Promise<{ data: PriorityResponse }> => {
      return await api.get("/priority-distribution", {
        params: orderIds.length > 0 ? { orderIds: orderIds.join(",") } : undefined,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 menit
  });
};

export const useGetPendingPriorityOrders = () => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["priority-distribution", "pending-orders"],
    queryFn: async (): Promise<{ data: PendingPriorityOrder[] }> => {
      return await api.get("/priority-distribution/pending-orders");
    },
    staleTime: 5 * 60 * 1000,
  });
};
