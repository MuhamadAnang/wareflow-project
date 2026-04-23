import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCustomer } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetReturnableCustomersQuery = () => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["returnable-customers"],
    queryFn: async (): Promise<TPaginationResponse<TCustomer>> => {
      // Gunakan pageSize yang lebih kecil (100) untuk menghindari 422
      return await api.get("/customers", { params: { page: 1, pageSize: 100 } });
    },
  });
};