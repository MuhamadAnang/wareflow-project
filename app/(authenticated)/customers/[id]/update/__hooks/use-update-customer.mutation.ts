import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateCustomer } from "@/schemas/customer.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdateCustomerMutation = (id: number) => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: TCreateOrUpdateCustomer) => {
      return await api.put(`/customers/${id}`, data);
    },
    onSuccess: () => {
      toast.success("Customer berhasil diperbarui", {
        onAutoClose: () => {
          router.push(`/customers/${id}`);
        },
      });

      queryClient.invalidateQueries({ queryKey: ["customer", id] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
