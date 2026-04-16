import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client"
import { useQuery } from "@tanstack/react-query";

export const useGetSubject = (id: number) => {
    const api = useAuthenticatedClient();

    return useQuery({
        queryKey: ["subject", id],
        queryFn: async () => {
            return await api.get(`/subjects/${id}`);
        },
        enabled: !!id,
    })
}