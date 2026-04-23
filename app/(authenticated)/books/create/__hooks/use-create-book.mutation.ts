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
    mutationFn: async (payload: any) => {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      return await api.post("/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Axios akan handle otomatis
        },
      });
    },
    onSuccess: () => {
      toast.success("Buku berhasil dibuat");
      router.push("/books");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Gagal membuat buku");
    },
  });
};