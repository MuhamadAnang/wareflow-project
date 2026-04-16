import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TGoodsReceiptDetail } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetGoodsReceipt = (id: number) => {
  const api = useAuthenticatedClient();
  return useQuery({
    queryKey: ["goods-receipt", id],
    queryFn: async (): Promise<TApiSuccessResponseWithData<TGoodsReceiptDetail>> => {
      return await api.get(`/goods-receipts/${id}`);
    },
    enabled: !!id,
  });
};