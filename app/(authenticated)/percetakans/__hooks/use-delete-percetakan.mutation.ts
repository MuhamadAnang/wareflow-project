import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeletePercetakanMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      return await api.delete(`/percetakans/${id}`);
    },
    onSuccess: () => {
      toast.success("percetakan berhasil dihapus");

      // Invalidate the percetakans query to refetch the updated list
      queryClient.invalidateQueries({
        queryKey: ["percetakans"],
      });
    },
  });
};
