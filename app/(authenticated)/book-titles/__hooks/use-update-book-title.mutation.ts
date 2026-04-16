import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateBookTitle } from "@/schemas/book-title.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useUpdateBookTitleMutation = (id: number) => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: TCreateOrUpdateBookTitle) => {
      return await api.put(`/book-titles/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-titles"] });
      router.push("/book-titles");
    },
    onError: (error) => {
      console.error("Gagal memperbarui judul buku:", error);
    },
  });
};