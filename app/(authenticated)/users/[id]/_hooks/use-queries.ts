import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client"
import { useQuery } from "@tanstack/react-query";
import { CLERK_USER_QUERIES_OPTIONS } from "../_api/queries";

export const useGetClerkUserByIdQuery = (id?: string) => {
    const api = useAuthenticatedClient();

    return useQuery(CLERK_USER_QUERIES_OPTIONS.getClerkUserById(api, id));
}