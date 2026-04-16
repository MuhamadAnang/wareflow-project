import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexCustomerOrderQuery } from "@/schemas/customer-order.schema";
import { TCustomerOrderListItem } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomerOrdersQuery = (queryParams: TIndexCustomerOrderQuery) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["customer-orders", queryParams],
    queryFn: async (): Promise<TPaginationResponse<TCustomerOrderListItem>> => {
      return await api.get("/customer-orders", { params: queryParams });
    },
  });
};