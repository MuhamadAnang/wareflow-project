import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexBookTitleQuery } from "@/schemas/book-title.schema";
import {  TBookTitleEnhanced } from "@/types/database"; 
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetBookTitlesQuery = (queryParams: TIndexBookTitleQuery) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["book-titles", queryParams],
    queryFn: async (): Promise<TPaginationResponse<TBookTitleEnhanced>> => {
      return await api.get("/book-titles", { params: queryParams });
    },
  });
};