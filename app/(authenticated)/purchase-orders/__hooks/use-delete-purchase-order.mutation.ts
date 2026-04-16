import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeletePurchaseOrderMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      return await api.delete(`/purchase-orders/${id}`);
    },
    onSuccess: () => {
      toast.success("Purchase Order deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete purchase order";
      toast.error(message);
    },
  });
};