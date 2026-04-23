import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexCustomerReturnQuery } from "@/schemas/customer-return.schema";
import { TCustomerReturnListItem } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomerReturnsQuery = (queryParams: TIndexCustomerReturnQuery) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["customer-returns", queryParams],
    queryFn: async (): Promise<TPaginationResponse<TCustomerReturnListItem>> => {
      return await api.get("/customer-returns", { params: queryParams });
    },
  });
};