import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TBookListItem } from "@/types/database";
import { TApiSuccessResponseWithPagination } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetReturnableBooksQuery = (customerId?: number) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["returnable-books", customerId],
    queryFn: async (): Promise<TApiSuccessResponseWithPagination<TBookListItem>> => {
      // Gunakan pageSize yang lebih kecil
      const response = await api.get("/books", { params: { page: 1, pageSize: 100 } });
      return response.data;
    },
    enabled: !!customerId,
  });
};
