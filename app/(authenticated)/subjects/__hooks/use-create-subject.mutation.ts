import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateSubject } from "@/schemas/subject.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateSubjectMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: TCreateOrUpdateSubject) => {
      return await api.post("/subjects", data);
    },
    onSuccess: () => {
      // Invalidate list agar refresh otomatis
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      // Redirect ke list
      router.push("/subjects");
      // Optional: bisa tambah toast success di sini nanti
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to create subject. Please try again.";
        toast.error(message);
        return;
      }
    },
  });
};
