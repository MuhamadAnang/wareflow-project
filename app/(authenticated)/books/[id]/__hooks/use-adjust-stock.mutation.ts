import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAdjustStockMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { bookId: number; quantity: number; note?: string }) => {
      return await api.post("/stock-movements/adjust", data);
    },
    onSuccess: () => {
      toast.success("Penyesuaian stok berhasil");
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Gagal melakukan adjustment stok");
    },
  });
};