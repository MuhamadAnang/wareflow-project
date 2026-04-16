import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreatePurchaseOrder } from "@/schemas/purchase-order.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreatePurchaseOrderMutation = () => {
  const api = useAuthenticatedClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreatePurchaseOrder) => {
      return await api.post("/purchase-orders", payload);
    },
    onSuccess: () => {
      toast.success("Purchase Order created successfully");
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      router.push("/purchase-orders");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create purchase order";
      toast.error(message);
    },
  });
};