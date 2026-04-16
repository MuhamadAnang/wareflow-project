"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";

export const useGetPurchaseOrderDetailQuery = (purchaseOrderId: number | null) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["purchase-order-detail", purchaseOrderId],
    queryFn: async () => {
      if (!purchaseOrderId) return null;
      const res = await api.get(`/purchase-orders/${purchaseOrderId}`);
      return res.data.data;
    },
    enabled: !!purchaseOrderId && purchaseOrderId > 0,
  });
};