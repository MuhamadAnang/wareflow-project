import { mutationOptions, QueryClient } from "@tanstack/react-query"
import { AxiosInstance, isAxiosError } from "axios";
import { toast } from "sonner";

export const CLERK_USERS_MUTATIONS_OPTIONS = {
    deleteClerkUser: (api: AxiosInstance, queryClient: QueryClient) => {
        return mutationOptions({
            mutationFn: async ({ id, }: { id: string }) => {
                // eslint-disable-next-line drizzle/enforce-delete-with-where
                return await api.delete(`/users/${id}`);
            },
            onSuccess: (data) => {
                toast.success(data.data.message);

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