import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TUpdateCustomerOrderStatus } from "@/schemas/customer-order.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateOrderStatusMutation = (id?: number) => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: TUpdateCustomerOrderStatus & { id?: number }) => {
      const orderId = id ?? params.id;
      if (!orderId) {
        throw new Error("Order id is required");
      }

      return await api.put(`/customer-orders/${orderId}`, { status: params.status });
    },
    onSuccess: (_data, variables) => {
      const orderId = id ?? variables.id;
      toast.success("Order status updated");
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: ["customer-order", orderId] });
      }
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
  });
};
