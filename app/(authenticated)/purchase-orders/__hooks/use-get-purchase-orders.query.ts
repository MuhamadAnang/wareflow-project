import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexPurchaseOrderQuery } from "@/schemas/purchase-order.schema";
import { TPurchaseOrderWithSupplier } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetPurchaseOrdersQuery = (queryParams: TIndexPurchaseOrderQuery) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["purchase-orders", queryParams],
    queryFn: async (): Promise<TPaginationResponse<TPurchaseOrderWithSupplier>> => {
      return await api.get("/purchase-orders", { params: queryParams });
    },
  });
};