import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteBookMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      return await api.delete(`/books/${id}`);
    },
    onSuccess: () => {
      toast.success("Buku berhasil dihapus (soft delete)");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (err) => {
      toast.error(err.message || "Gagal menghapus buku");
    },
  });
};