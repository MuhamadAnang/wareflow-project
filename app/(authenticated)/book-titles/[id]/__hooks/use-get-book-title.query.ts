import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TBookTitleEnhanced } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetBookTitle = (id: number) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["bookTitle", id],
    queryFn: async (): Promise<TApiSuccessResponseWithData<TBookTitleEnhanced>> => {
      return await api.get(`/book-titles/${id}`);
    },
    enabled: !!id,
  });
};
