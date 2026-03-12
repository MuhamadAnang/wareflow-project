import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateOrUpdateCustomer } from "@/schemas/customer.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateCustomerMutation = () => {
  const api = useAuthenticatedClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateOrUpdateCustomer) => {
      return await api.post("/customers", payload);
    },
    onSuccess: () => {
      toast.success("Customer created successfully", {
        onAutoClose: () => {
          router.push("/customers");
        },
        duration: 300,
      });

      // Invalidate the customers query to refetch the updated list
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
};
