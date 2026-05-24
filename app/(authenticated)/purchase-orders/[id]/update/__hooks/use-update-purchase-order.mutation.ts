import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TUpdatePurchaseOrder } from "@/schemas/purchase-order.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdatePurchaseOrderMutation = (id: number) => {
  const api = useAuthenticatedClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TUpdatePurchaseOrder) => {
      try {
        const response = await api.put(`/purchase-orders/${id}`, payload);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Purchase Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-order", id] });
      router.push(`/purchase-orders/${id}`);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to update purchase order";
        toast.error(message);
        return;
      }
    },
  });
};
