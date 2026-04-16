import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TBookListItem } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetBooksDropdownQuery = () => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["books-dropdown"],
    queryFn: async (): Promise<TPaginationResponse<TBookListItem>> => {
      return await api.get("/books", { params: { page: 1, pageSize: 100 } });
    },
  });
};