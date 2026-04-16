import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TUpdateCustomerOrderStatus } from "@/schemas/customer-order.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateOrderStatusMutation = (id: number) => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TUpdateCustomerOrderStatus) => {
      return await api.put(`/customer-orders/${id}`, data);
    },
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["customer-order", id] });
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
  });
};