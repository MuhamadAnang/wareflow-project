"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexGoodsReceiptQuery } from "@/schemas/goods-receipt.schema";
import { TGoodsReceiptWithItems } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetGoodsReceiptsQuery = (queryParams: TIndexGoodsReceiptQuery) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["goods-receipts", queryParams],
    queryFn: async (): Promise<TPaginationResponse<TGoodsReceiptWithItems>> => {
      return await api.get("/goods-receipts", { params: queryParams });
    },
  });
};