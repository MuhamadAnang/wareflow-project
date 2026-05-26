import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export const useAdjustStockMutation = (bookId?: number) => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { bookId: number; quantity: number; note?: string }) => {
      return await api.post("/stock-movements/adjust", data);
    },
    onSuccess: () => {
      toast.success("Penyesuaian stok berhasil");

      // 👇 Invalidate queries agar UI auto-update
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });

      // Jika bookId tersedia, refetch detail buku agar stok di header update
      if (bookId) {
        queryClient.invalidateQueries({ queryKey: ["book", bookId] });
      }
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Gagal melakukan adjustment stok");
      }
    },
  });
};
