import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateCustomerReturn } from "@/schemas/customer-return.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateCustomerReturnMutation = () => {
  const api = useAuthenticatedClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateCustomerReturn) => {
      return await api.post("/customer-returns", payload);
    },
    onSuccess: () => {
      toast.success("Retur customer berhasil dibuat", {
        onAutoClose: () => router.push("/returns/customer"),
      });
      queryClient.invalidateQueries({ queryKey: ["customer-returns"] });
      queryClient.invalidateQueries({ queryKey: ["books"] }); // refresh stok
    },
  });
};