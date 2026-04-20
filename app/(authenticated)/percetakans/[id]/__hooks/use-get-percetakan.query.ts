import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TPercetakan } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetPercetakan = (id: number) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["percetakan", id],
    queryFn: async (): Promise<TApiSuccessResponseWithData<TPercetakan>> => {
      return await api.get(`/percetakans/${id}`);
    },
    enabled: !!id,
  });
};
