import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TUpdateGoodsReceipt } from "@/schemas/goods-receipt.schema";
import type { TBaseApiResponse } from "@/types/response";
import type { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdateGoodsReceiptMutation = (id: number) => {
  const api = useAuthenticatedClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<unknown>, AxiosError<TBaseApiResponse>, TUpdateGoodsReceipt>({
    mutationFn: async (payload: TUpdateGoodsReceipt) => {
      return await api.put(`/goods-receipts/${id}`, payload);
    },
    onSuccess: () => {
      toast.success("Goods Receipt updated successfully");
      queryClient.invalidateQueries({ queryKey: ["goods-receipts"] });
      queryClient.invalidateQueries({ queryKey: ["goods-receipt", id] });
      router.push(`/goods-receipts/${id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update goods receipt");
    },
  });
};
