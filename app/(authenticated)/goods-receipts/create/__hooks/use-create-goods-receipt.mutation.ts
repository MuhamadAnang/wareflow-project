"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateGoodsReceipt } from "@/schemas/goods-receipt.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateGoodsReceiptMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: TCreateGoodsReceipt) => {
      console.log("📤 Sending Goods Receipt payload:", data);
      const res = await api.post("/goods-receipts", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Goods Receipt berhasil dibuat", {
        description: "Barang telah diterima",
      });

      queryClient.invalidateQueries({ queryKey: ["goods-receipts"] });

      // Redirect ke list setelah sukses
      setTimeout(() => {
        router.push("/goods-receipts");
      }, 1200);
    },
    onError: (error: any) => {
      console.error("Create Goods Receipt error:", error);
      toast.error(error?.response?.data?.message || "Gagal membuat Goods Receipt");
    },
  });
};