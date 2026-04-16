import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteSupplierMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      return await api.delete(`/suppliers/${id}`);
    },
    onSuccess: () => {
      toast.success("Supplier deleted successfully");

      // Invalidate the suppliers query to refetch the updated list
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
  });
};
