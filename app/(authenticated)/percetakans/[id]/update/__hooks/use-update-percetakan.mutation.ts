import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdatePercetakan } from "@/schemas/percetakan.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdatePercetakanMutation = (id: number) => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: TCreateOrUpdatePercetakan) => {
      return await api.put(`/percetakans/${id}`, data);
    },
    onSuccess: () => {
      toast.success("percetakan berhasil diperbarui", {
        onAutoClose: () => {
          router.push(`/percetakans/${id}`);
        },
      });

      queryClient.invalidateQueries({ queryKey: ["percetakan", id] });
      queryClient.invalidateQueries({ queryKey: ["percetakans"] });
    },
  });
};
