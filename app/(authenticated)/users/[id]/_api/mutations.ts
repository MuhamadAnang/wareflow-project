import { TActionApprovalUser } from "@/schemas/clerk.schema";
import { mutationOptions, QueryClient } from "@tanstack/react-query"
import { AxiosInstance, isAxiosError } from "axios";
import { toast } from "sonner";

export const CLERK_USER_MUTATIONS_OPTIONS = {
    actionApprovalUser: (api: AxiosInstance, queryClient: QueryClient) => {
        return mutationOptions({
            mutationFn: async ({ id, payload }: { id: string, payload: TActionApprovalUser }) => {
                return await api.post(`/users/${id}`, payload);
            },
            onSuccess: (data) => {
                toast.success(data.data.message);

                queryClient.invalidateQueries({ queryKey: ["clerk-user"] });
                queryClient.invalidateQueries({ queryKey: ["clerk-users"] });
            },
            onError: (error) => {
                if (isAxiosError(error)) {
                    toast.error(error.response?.data.message || "An error occurred while updating the user.");
                }
            }
        })
    }
}