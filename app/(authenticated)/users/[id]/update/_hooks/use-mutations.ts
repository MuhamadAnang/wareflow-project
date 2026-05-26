import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CLERK_UPDATE_USER_MUTATIONS_OPTIONS } from "../_api/mutations";
import { useRouter } from "next/navigation";

export const useUpdateClerkUser = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(CLERK_UPDATE_USER_MUTATIONS_OPTIONS.updateClerkUser(api, queryClient, router));
};
