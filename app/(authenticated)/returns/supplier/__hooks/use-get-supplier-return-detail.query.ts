import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TSupplierReturnDetail } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetSupplierReturnDetail = (id: number) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["supplier-return", id],
    queryFn: async (): Promise<TApiSuccessResponseWithData<TSupplierReturnDetail>> => {
      return await api.get(`/supplier-returns/${id}`);
    },
    enabled: !!id,
  });
};