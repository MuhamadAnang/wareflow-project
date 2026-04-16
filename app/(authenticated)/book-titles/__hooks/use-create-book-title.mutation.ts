import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateBookTitle } from "@/schemas/book-title.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useCreateBookTitleMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: TCreateOrUpdateBookTitle) => {
      return await api.post("/book-titles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-titles"] });
      router.push("/book-titles");
    },
    onError: (error) => {
      console.error("Gagal membuat judul buku:", error);
    },
  });
};