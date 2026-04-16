import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateSupplier } from "@/schemas/supplier.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdateSupplierMutation = (id: number) => {
    const api = useAuthenticatedClient();
    const queryClient = useQueryClient();
    const router = useRouter();
  
    return useMutation({
      mutationFn: async (data: TCreateOrUpdateSupplier) => {
        return await api.put(`/suppliers/${id}`, data);
      },
      onSuccess: () => {
        toast.success("Supplier updated successfully", {
          onAutoClose: () => {
            router.push(`/suppliers/${id}`);
          },
        });
  
        queryClient.invalidateQueries({ queryKey: ["supplier", id] });
        queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      },
    });
  };
  