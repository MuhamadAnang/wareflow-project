import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteSubjectMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      return await api.delete(`/subjects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      // Optional: toast "Berhasil dihapus"
    },
    onError: (error) => {
      console.error("Delete subject error:", error);
      // Optional: toast error
    },
  });
};
