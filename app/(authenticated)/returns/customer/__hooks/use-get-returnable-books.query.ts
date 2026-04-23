import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TBookListItem } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetReturnableBooksQuery = (customerId?: number) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["returnable-books", customerId],
    queryFn: async (): Promise<TPaginationResponse<TBookListItem>> => {
      // Gunakan pageSize yang lebih kecil
      return await api.get("/books", { params: { page: 1, pageSize: 100 } });
    },
    enabled: !!customerId,
  });
};