import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TBookListItem } from "@/types/database";
import { useQuery } from "@tanstack/react-query";

export const useBookSearch = (search?: string) => {
  const api = useAuthenticatedClient();
  return useQuery({
    queryKey: ["books-select", search],
    queryFn: async () => {
      const res = await api.get("/books", { params: { pageSize: 1000, search } });
      return res.data as TBookListItem[];
    },
  });
};