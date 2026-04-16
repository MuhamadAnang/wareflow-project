import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TGoodsOutDetail } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetGoodsOutDetail = (id: number) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["goods-out", id],
    queryFn: async (): Promise<TApiSuccessResponseWithData<TGoodsOutDetail>> => {
      return await api.get(`/goods-out/${id}`);
    },
    enabled: !!id,
  });
};