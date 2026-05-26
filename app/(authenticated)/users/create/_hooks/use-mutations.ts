import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CLERK_CREATE_USER_MUTATIONS_OPTIONS } from "../_api/mutations";
import { useRouter } from "next/navigation";

export const useCreateClerkUser = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(CLERK_CREATE_USER_MUTATIONS_OPTIONS.createClerkUser(api, queryClient, router));
};
