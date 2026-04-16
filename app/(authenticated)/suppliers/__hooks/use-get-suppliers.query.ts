import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexSupplierQuery } from "@/schemas/supplier.schema";
import { TSupplier } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetSuppliersQuery = (queryParams: TIndexSupplierQuery) => {
    const api = useAuthenticatedClient();

    return useQuery({
        queryKey: ["suppliers", queryParams],
        queryFn: async (): Promise<TPaginationResponse<TSupplier>> => {
            return await api.get("/suppliers", { params: queryParams });
        },
    })
};