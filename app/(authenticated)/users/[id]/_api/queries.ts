import { TClerkUser } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance } from "axios";


export const CLERK_USER_QUERIES_OPTIONS = {
    getClerkUserById: (api: AxiosInstance, id?: string) => {
        return queryOptions({
            queryKey: ["clerk-user", id],
            queryFn: async (): Promise<TApiSuccessResponseWithData<TClerkUser>> => {
                return await api.get(`/users/${id}`);
            },
            enabled: !!id, // Hanya aktifkan query jika id tersedia
        })
    }
}
