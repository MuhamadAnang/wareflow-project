import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";

export const useGetPercetakansQuery = () => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["percetakans-short"],
    queryFn: async () => {
      try {
        const res = await api.get("/percetakans", {
          params: { page: 1, pageSize: 100 },
        });
        return res.data.data as { id: number; name: string }[];
      } catch (error) {
        console.warn("Gagal mengambil data percetakan, menggunakan data kosong");
        return [];   // ← Penting! Kembalikan array kosong, jangan undefined
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 menit
  });
};