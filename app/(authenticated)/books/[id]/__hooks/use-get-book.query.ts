import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TBookListItem } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetBook = (id: number) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["book", id],
    queryFn: async (): Promise<TApiSuccessResponseWithData<TBookListItem>> => {
      return await api.get(`/books/${id}`);
    },
    enabled: !!id && !isNaN(id), // aman kalau id invalid
  });
};