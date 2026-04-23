import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TSupplier } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetReturnableSuppliersQuery = () => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["returnable-suppliers"],
    queryFn: async (): Promise<TPaginationResponse<TSupplier>> => {
      return await api.get("/suppliers", { params: { page: 1, pageSize: 100 } });
    },
  });
};