import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateCustomer } from "@/schemas/customer.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCustomerQuickMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateOrUpdateCustomer) => {
      const response = await api.post("/customers", payload);
      console.log("FULL RESPONSE:", JSON.stringify(response, null, 2));
      console.log("response.data:", response.data);
      console.log("response.data.data:", response.data?.data);
      console.log("response.data.data.id:", response.data?.data?.id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers-dropdown"] });
      // "customers" juga, agar list di halaman customers ikut refresh
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};