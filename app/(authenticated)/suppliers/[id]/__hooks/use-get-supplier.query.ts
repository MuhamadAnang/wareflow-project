import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TSupplier } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetSupplier = (id: number) => {
    const api = useAuthenticatedClient();
  
    return useQuery({
      queryKey: ["supplier", id],
      queryFn: async (): Promise<TApiSuccessResponseWithData<TSupplier>> => {
        return await api.get(`/suppliers/${id}`);
      },
      enabled: !!id,
    });
  };
  