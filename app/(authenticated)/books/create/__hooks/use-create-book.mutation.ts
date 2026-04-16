import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateBook } from "@/schemas/book.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateBookMutation = () => {
  const api = useAuthenticatedClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateOrUpdateBook) => {
      return await api.post("/books", payload);
    },
    onSuccess: () => {
      toast.success("Buku berhasil dibuat", { duration: 3000 });
      router.push("/books");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (err) => {
      toast.error(err.message || "Gagal membuat buku");
    },
  });
};