import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";
import { CLERK_USERS_QUERIES_OPTIONS } from "../_api/queries";
import { TIndexQueryParams } from "@/types/query-params";

export const useGetClerkUsersQuery = (queryParams: TIndexQueryParams) => {
  const api = useAuthenticatedClient();

  return useQuery(CLERK_USERS_QUERIES_OPTIONS.getClerkUsers(api, queryParams));
};
