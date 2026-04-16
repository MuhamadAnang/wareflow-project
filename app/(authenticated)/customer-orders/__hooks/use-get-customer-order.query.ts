import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCustomerOrderDetail } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomerOrder = (id: number) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["customer-order", id],
    queryFn: async (): Promise<TApiSuccessResponseWithData<TCustomerOrderDetail>> => {
      return await api.get(`/customer-orders/${id}`);
    },
    enabled: !!id,
  });
};  