// app/(authenticated)/books/__hooks/use-get-books.query.ts
import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexBookQuery } from "@/schemas/book.schema";
// import { TBookListItem } from "@/types/database";
// import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetBooksQuery = (queryParams: Partial<TIndexBookQuery> = {}) => {
  const safeParams: TIndexBookQuery = {
    page: Math.max(1, Number(queryParams.page) || 1),
    pageSize: Math.max(1, Math.min(100, Number(queryParams.pageSize) || 20)),
    search: queryParams.search || undefined,
    sort: queryParams.sort || undefined,
    bookTitleId: queryParams.bookTitleId ? Number(queryParams.bookTitleId) : undefined,
    supplierId: queryParams.supplierId ? Number(queryParams.supplierId) : undefined,
    semester: queryParams.semester || undefined,
  };

  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["books", safeParams],
    queryFn: async () => api.get("/books", { params: safeParams }),
  });
};