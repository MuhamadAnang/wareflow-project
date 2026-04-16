import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateBookTitle } from "@/schemas/book-title.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateBookTitleMutation = () => {
  const api = useAuthenticatedClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateOrUpdateBookTitle) => {
      return await api.post("/bookTitles", payload);
    },
    onSuccess: () => {
      toast.success("BookTitle created successfully", {
        onAutoClose: () => {
          router.push("/bookTitles");
        },
        duration: 300,
      });

      // Invalidate the BookTitles query to refetch the updated list
      queryClient.invalidateQueries({
        queryKey: ["bookTitles"],
      });
    },
  });
};
