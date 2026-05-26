import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateBook } from "@/schemas/book.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdateBookMutation = (id: number) => {
  const api = useAuthenticatedClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateOrUpdateBook) => {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        // Deteksi File lebih robust — hindari instanceof yang bisa gagal lintas konteks
        const isFile = value instanceof File;

        if (isFile) {
          formData.append(key, value as File);
        } else if (typeof value === "string" && value !== "") {
          // String kosong di-skip, string URL gambar lama tetap dikirim
          formData.append(key, value);
        } else if (typeof value !== "object") {
          // number, boolean, dll
          formData.append(key, String(value));
        }
        // object yang bukan File (seperti {}) di-skip total
      });

      return await api.put(`/books/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // ← ini yang hilang di versi lama
        },
      });
    },
    onSuccess: () => {
      toast.success("Buku berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["book", id] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      router.push(`/books/${id}`);
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Gagal memperbarui buku");
      }
    },
  });
};
