import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TBookListItem } from "@/types/database";
import { TApiSuccessResponseWithPagination } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetReturnableBooksSupplierQuery = () => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["returnable-books-supplier"],
    queryFn: async (): Promise<TApiSuccessResponseWithPagination<TBookListItem>> => {
      const response = await api.get("/books", { params: { page: 1, pageSize: 100 } });
      return response.data;
    },
  });
};
