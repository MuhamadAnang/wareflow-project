import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TBookListItem } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetBooksForOrderQuery = () => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["books-for-order"],
    queryFn: async (): Promise<TApiSuccessResponseWithData<TBookListItem[]>> => {
      return await api.get("/books", { params: { pageSize: 9999 } });
    },
  });
};