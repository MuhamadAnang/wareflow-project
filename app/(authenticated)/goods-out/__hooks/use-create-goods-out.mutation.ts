import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateGoodsOut } from "@/schemas/goods-out.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateGoodsOutMutation = () => {
  const api = useAuthenticatedClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateGoodsOut) => {
      return await api.post("/goods-out", payload);
    },
    onSuccess: () => {
      toast.success("Goods out created successfully", {
        onAutoClose: () => router.push("/goods-out"),
      });
      // Invalidate semua query yang terpengaruh pembuatan goods out
      queryClient.invalidateQueries({ queryKey: ["goods-out"] });
      queryClient.invalidateQueries({ queryKey: ["available-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-items-for-shipment"] }); 
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });          
    },
  });
};