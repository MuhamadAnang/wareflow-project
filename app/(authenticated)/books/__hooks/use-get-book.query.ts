// app/(authenticated)/books/__hooks/use-get-books.query.ts
import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexBookQuery } from "@/schemas/book.schema";
import { TBookListItem } from "@/types/database";
import { TApiSuccessResponseWithPagination } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetBooksQuery = (queryParams: Partial<TIndexBookQuery> = {}) => {
  const safeParams: TIndexBookQuery = {
    page: Math.max(1, Number(queryParams.page) || 1),
    pageSize: Math.max(1, Math.min(100, Number(queryParams.pageSize) || 20)),
    search: queryParams.search || undefined,
    sort: queryParams.sort || undefined,
    subjectId: queryParams.subjectId ? Number(queryParams.subjectId) : undefined,
    grade: queryParams.grade ? Number(queryParams.grade) : undefined,
    level: queryParams.level || undefined,
    curriculum: queryParams.curriculum || undefined,
    semester: queryParams.semester || undefined,
    percetakanId: queryParams.percetakanId ? Number(queryParams.percetakanId) : undefined,
  };

  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["books", safeParams],
    queryFn: async (): Promise<TApiSuccessResponseWithPagination<TBookListItem>> => {
      const response = await api.get("/books", { params: safeParams });
      return response.data;
    },
  });
};
