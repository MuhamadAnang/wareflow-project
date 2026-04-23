import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCustomerReturnDetail } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomerReturnDetail = (id: number) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["customer-return", id],
    queryFn: async (): Promise<TApiSuccessResponseWithData<TCustomerReturnDetail>> => {
      return await api.get(`/customer-returns/${id}`);
    },
    enabled: !!id,
  });
};