import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCustomerOrderWithCustomer } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetAvailableOrdersQuery = () => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["available-orders"],
    queryFn: async (): Promise<TApiSuccessResponseWithData<TCustomerOrderWithCustomer[]>> => {
      return await api.get("/available");
    },
  });
};