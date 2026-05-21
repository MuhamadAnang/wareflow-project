import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TBookListItem } from "@/types/database";
import { TApiSuccessResponseWithPagination } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetBooksDropdownQuery = () => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["books-dropdown"],
    queryFn: async (): Promise<TApiSuccessResponseWithPagination<TBookListItem>> => {
      const response = await api.get("/books", { params: { page: 1, pageSize: 100 } });
      return response.data;
    },
  });
};
