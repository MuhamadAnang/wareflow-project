import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TUpdatePurchaseOrder } from "@/schemas/purchase-order.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdatePurchaseOrderMutation = (id: number) => {
  const api = useAuthenticatedClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TUpdatePurchaseOrder) => {
      console.log("📤 MutationFn called with payload:", payload);
      console.log(`🆔 Updating PO ID: ${id}`);
      
      try {
        const response = await api.put(`/purchase-orders/${id}`, payload);
        console.log("📥 Response from server:", response);
        return response.data;
      } catch (error) {
        console.error("❌ Error in mutationFn:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("✅ Update success, data:", data);
      toast.success("Purchase Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-order", id] });
      router.push(`/purchase-orders/${id}`);
    },
    onError: (error: any) => {
      console.error("❌ Mutation error:", error);
      const message = error.response?.data?.message || error.message || "Failed to update purchase order";
      toast.error(message);
    },
  });
};