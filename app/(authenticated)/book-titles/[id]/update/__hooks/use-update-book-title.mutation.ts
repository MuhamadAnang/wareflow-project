import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateBookTitle } from "@/schemas/book-title.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdateBookTitleMutation = (id: number) => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: TCreateOrUpdateBookTitle) => {
      return await api.put(`/book-titles/${id}`, data);
    },
    onSuccess: () => {
      toast.success("BookTitle updated successfully", {
        onAutoClose: () => {
          router.push(`/book-titles/${id}`);
        },
      });

      queryClient.invalidateQueries({ queryKey: ["bookTitle", id] });
      queryClient.invalidateQueries({ queryKey: ["bookTitles"] });
    },
  });
};
