import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteGoodsReceiptMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
       // eslint-disable-next-line drizzle/enforce-delete-with-where
      return await api.delete(`/goods-receipts/${id}`);
    },
    onSuccess: () => {
      toast.success("Goods Receipt deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["goods-receipts"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete goods receipt");
    },
  });
};