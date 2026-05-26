import { TCreateOrUpdateClerkUserSchema } from "@/schemas/clerk.schema";
import { mutationOptions, QueryClient } from "@tanstack/react-query"
import { AxiosInstance, isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CLERK_UPDATE_USER_MUTATIONS_OPTIONS = {
    updateClerkUser: (api: AxiosInstance, queryClient: QueryClient, router: ReturnType<typeof useRouter>) => {
        return mutationOptions({
            mutationFn: async ({ id, payload }: { id: string, payload: TCreateOrUpdateClerkUserSchema }) => {
                return await api.put(`/users/${id}`, payload);
            },
            onSuccess: (data) => {
                toast.success(data.data.message);

                queryClient.invalidateQueries({ queryKey: ["clerk-users"] });
                router.push("/users");
            },
            onError: (error) => {
                if (isAxiosError(error)) {
                    toast.error(error.response?.data.message || "An error occurred while updating the user.");
                }
            }
        })
    }
}