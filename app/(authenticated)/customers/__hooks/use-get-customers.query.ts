import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexCustomerQuery } from "@/schemas/customer.schema";
import { TCustomer } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomersQuery = (queryParams: TIndexCustomerQuery) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["customers", queryParams],
    queryFn: async (): Promise<TPaginationResponse<TCustomer>> => {
      return await api.get("/customers", { params: queryParams });
    },
  });
};
