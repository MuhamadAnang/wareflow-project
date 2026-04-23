import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateSupplierReturn } from "@/schemas/supplier-return.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateSupplierReturnMutation = () => {
  const api = useAuthenticatedClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateSupplierReturn) => {
      return await api.post("/supplier-returns", payload);
    },
    onSuccess: () => {
      toast.success("Retur supplier berhasil dibuat", {
        onAutoClose: () => router.push("/returns/supplier"),
      });
      queryClient.invalidateQueries({ queryKey: ["supplier-returns"] });
      queryClient.invalidateQueries({ queryKey: ["books"] }); // refresh stok
    },
  });
};