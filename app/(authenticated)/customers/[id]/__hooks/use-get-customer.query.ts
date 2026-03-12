import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCustomer } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomer = (id: number) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["customer", id],
    queryFn: async (): Promise<TApiSuccessResponseWithData<TCustomer>> => {
      return await api.get(`/customers/${id}`);
    },
    enabled: !!id,
  });
};
