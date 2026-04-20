import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexPercetakanQuery } from "@/schemas/percetakan.schema";
import { TPercetakan } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetPercetakansQuery = (queryParams: TIndexPercetakanQuery) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["percetakans", queryParams],
    queryFn: async (): Promise<TPaginationResponse<TPercetakan>> => {
      return await api.get("/percetakans", { params: queryParams });
    },
  });
};
