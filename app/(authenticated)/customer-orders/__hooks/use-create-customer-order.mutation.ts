import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCreateCustomerOrder } from "@/schemas/customer-order.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateCustomerOrderMutation = () => {
  const api = useAuthenticatedClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateCustomerOrder) => {
      return await api.post("/customer-orders", payload);
    },
    onSuccess: () => {
      toast.success("Customer order created successfully", {
        onAutoClose: () => router.push("/customer-orders"),
      });
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
  });
};