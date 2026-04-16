import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteBookTitleMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      return await api.delete(`/book-titles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-titles"] });
    },
    onError: (error) => {
      console.error("Gagal menghapus judul buku:", error);
    },
  });
};