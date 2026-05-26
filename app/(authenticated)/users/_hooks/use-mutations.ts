import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CLERK_USERS_MUTATIONS_OPTIONS } from "../_api/mutations";

export const useDeleteClerkUser = () => {
    const api = useAuthenticatedClient();
    const queryClient = useQueryClient();

    return useMutation(CLERK_USERS_MUTATIONS_OPTIONS.deleteClerkUser(api, queryClient));
}