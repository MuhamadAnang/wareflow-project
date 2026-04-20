import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdatePercetakan } from "@/schemas/percetakan.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreatePercetakanMutation = () => {
  const api = useAuthenticatedClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateOrUpdatePercetakan) => {
      return await api.post("/percetakans", payload);
    },
    onSuccess: () => {
      toast.success("Percetakan berhasil dibuat", {
        onAutoClose: () => {
          router.push("/percetakans");
        },
        duration: 300,
      });

      // Invalidate the percetakans query to refetch the updated list
      queryClient.invalidateQueries({
        queryKey: ["percetakans"],
      });
    },
  });
};
