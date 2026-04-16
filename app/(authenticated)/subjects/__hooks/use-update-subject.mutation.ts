import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateSubject } from "@/schemas/subject.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useUpdateSubjectMutation = (subjectId: number) => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: TCreateOrUpdateSubject) => {
      return await api.put(`/subjects/${subjectId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["subject", subjectId] }); // jika ada detail query
      router.push("/subjects");
    },
    onError: (error) => {
      console.error("Update subject error:", error);
    },
  });
};