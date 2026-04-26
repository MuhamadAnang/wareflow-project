import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";

export interface PriorityResult {
  id: number;
  customerName: string;
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
  orderDetails?: any;
}

export interface PriorityResponse {
  priorities: PriorityResult[];
  totalOrders: number;
  calculatedAt: string;
}

export const useGetPriorityDistribution = () => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["priority-distribution"],
    queryFn: async (): Promise<{ data: PriorityResponse }> => {
      return await api.get("/priority-distribution");
    },
    staleTime: 5 * 60 * 1000, // 5 menit
  });
};