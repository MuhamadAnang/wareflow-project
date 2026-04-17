import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteCustomerMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      return await api.delete(`/customers/${id}`);
    },
    onSuccess: () => {
      toast.success("Customer berhasil dihapus");

      // Invalidate the customers query to refetch the updated list
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
};
