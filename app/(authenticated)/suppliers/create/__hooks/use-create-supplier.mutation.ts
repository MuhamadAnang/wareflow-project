import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateSupplier } from "@/schemas/supplier.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateSupplierMutation = () => {
    const api = useAuthenticatedClient();
    const router = useRouter();
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (payload: TCreateOrUpdateSupplier) => {
        return await api.post("/suppliers", payload);
      },
      onSuccess: () => {
        toast.success("Supplier berhasil ditambahkan", {
          onAutoClose: () => {
            router.push("/suppliers");
          },
          duration: 300,
        });
  
        // Invalidate the suppliers query to refetch the updated list
        queryClient.invalidateQueries({
          queryKey: ["suppliers"],
        });
      },
    });
  };
  