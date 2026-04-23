import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexSupplierReturnQuery } from "@/schemas/supplier-return.schema";
import { TSupplierReturnListItem } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetSupplierReturnsQuery = (queryParams: TIndexSupplierReturnQuery) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["supplier-returns", queryParams],
    queryFn: async (): Promise<TPaginationResponse<TSupplierReturnListItem>> => {
      return await api.get("/supplier-returns", { params: queryParams });
    },
  });
};