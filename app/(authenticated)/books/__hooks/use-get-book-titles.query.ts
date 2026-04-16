import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";

export const useGetBookTitlesQuery = () => {
    const api = useAuthenticatedClient();
  
    return useQuery({
      queryKey: ["book-titles-short"],
      queryFn: async () => {
        const res = await api.get("/book-titles", {
          params: {
            page: 1,
            pageSize: 50  // pakai pageSize, bukan limit
          }
        });
        return res.data.data as { id: number; displayTitle: string }[];
      },
    });
  };