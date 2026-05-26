import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CLERK_USER_MUTATIONS_OPTIONS } from "../_api/mutations";

export const useActionApprovalUser = () => {
    const api = useAuthenticatedClient();
    const queryClient = useQueryClient();

    return useMutation(CLERK_USER_MUTATIONS_OPTIONS.actionApprovalUser(api, queryClient));
}