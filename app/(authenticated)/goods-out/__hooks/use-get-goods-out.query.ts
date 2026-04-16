import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexGoodsOutQuery } from "@/schemas/goods-out.schema";
import { TGoodsOutListItem } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetGoodsOutQuery = (queryParams: TIndexGoodsOutQuery) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["goods-out", queryParams],
    queryFn: async (): Promise<TPaginationResponse<TGoodsOutListItem>> => {
      return await api.get("/goods-out", { params: queryParams });
    },
  });
};