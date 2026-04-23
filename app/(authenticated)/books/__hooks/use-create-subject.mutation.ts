import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateSubjectMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string }) => {
      return await api.post("/subjects", data);
    },
    onSuccess: () => {
      toast.success("Mata pelajaran baru berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["subjects-short"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Gagal menambahkan mata pelajaran");
    },
  });
};