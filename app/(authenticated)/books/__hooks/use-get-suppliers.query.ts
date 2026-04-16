import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";

export const useGetSuppliersQuery = () => {
    const api = useAuthenticatedClient();
  
    return useQuery({
      queryKey: ["suppliers-short"],
      queryFn: async () => {
        const res = await api.get("/suppliers", {
          params: {
            page: 1,
            pageSize: 50
          }
        });
        return res.data.data as { id: number; name: string }[];
      },
    });
  };