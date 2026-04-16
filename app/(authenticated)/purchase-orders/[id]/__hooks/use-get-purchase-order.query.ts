import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TPurchaseOrderDetail } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetPurchaseOrder = (id: number) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["purchase-order", id],
    queryFn: async (): Promise<TApiSuccessResponseWithData<TPurchaseOrderDetail>> => {
      return await api.get(`/purchase-orders/${id}`);
    },
    enabled: !!id,
  });
};