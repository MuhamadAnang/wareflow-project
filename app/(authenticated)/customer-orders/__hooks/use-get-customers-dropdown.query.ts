import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCustomer } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomersDropdownQuery = () => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["customers-dropdown"],
    queryFn: async (): Promise<TPaginationResponse<TCustomer>> => {
      return await api.get("/customers", { params: { page: 1, pageSize: 100 } });
    },
  });
};