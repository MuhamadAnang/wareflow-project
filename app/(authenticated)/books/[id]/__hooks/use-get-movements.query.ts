import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";

export type TStockMovement = {
  id: number;
  bookId: number;
  type: "IN_PURCHASE" | "OUT_SALES" | "RETURN_CUSTOMER" | "RETURN_SUPPLIER" | "ADJUSTMENT";
  referenceType: string;
  referenceId: number;
  quantity: number;
  note: string | null;
  createdAt: Date;
};

export const useGetStockMovementsQuery = (bookId: number) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["stock-movements", bookId],
    queryFn: async () => {
      const res = await api.get(`/stock-movements`, {
        params: { bookId },
      });
      return res.data.data as TStockMovement[];
    },
    enabled: !!bookId,
  });
};