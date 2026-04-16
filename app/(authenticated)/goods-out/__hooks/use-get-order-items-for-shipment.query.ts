import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TCustomerOrderDetail } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetOrderItemsForShipment = (orderId: number) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["order-items-for-shipment", orderId],
    queryFn: async (): Promise<TApiSuccessResponseWithData<TCustomerOrderDetail>> => {
      return await api.get(`/customer-orders/${orderId}`);
    },
    enabled: !!orderId,
  });
};