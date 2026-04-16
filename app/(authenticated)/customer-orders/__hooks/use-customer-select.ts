import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCustomer } from "@/types/database";
import { useQuery } from "@tanstack/react-query";

export const useCustomerSelect = () => {
  const api = useAuthenticatedClient();
  return useQuery({
    queryKey: ["customers-select"],
    queryFn: async () => {
      const res = await api.get("/customers", { params: { pageSize: 1000 } });
      return res.data as TCustomer[];
    },
  });
};