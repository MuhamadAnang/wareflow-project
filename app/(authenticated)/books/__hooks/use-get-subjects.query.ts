import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";

export const useGetSubjectsQuery = () => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["subjects-short"],
    // use-get-subjects.query.ts
    queryFn: async () => {
      try {
        const res = await api.get("/subjects", { params: { page: 1, pageSize: 100 } });
        return res.data.data as { id: number; name: string }[];
      } catch {
        return [];
      }
    },
  });
};

