import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexSubjectQuery } from "@/schemas/subject.schema";
import { TSubject } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetSubjectsQuery = (queryParams: TIndexSubjectQuery) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["subjects", queryParams],
    queryFn: async (): Promise<TPaginationResponse<TSubject>> => {
      return await api.get("/subjects", { params: queryParams });
    },
  });
};