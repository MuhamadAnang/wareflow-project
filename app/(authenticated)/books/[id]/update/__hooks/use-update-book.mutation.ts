import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateBook } from "@/schemas/book.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdateBookMutation = (id: number) => {
  const api = useAuthenticatedClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TCreateOrUpdateBook) => {
      return await api.put(`/books/${id}`, data);
    },
    onSuccess: () => {
      toast.success("Buku berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["book", id] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      router.push(`/books/${id}`);
    },
    onError: (err) => {
      toast.error(err.message || "Gagal memperbarui buku");
    },
  });
};