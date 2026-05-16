import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateBook } from "@/schemas/book.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBookQuickMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateOrUpdateBook) => {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (value instanceof File) {
          formData.append(key, value);
          return;
        }

        formData.append(key, String(value));
      });

      return await api.post("/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books-dropdown"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["books-for-order"] });
    },
  });
};
