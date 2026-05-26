import { TClerkUser } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { TIndexQueryParams } from "@/types/query-params";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

export const CLERK_USERS_QUERIES_OPTIONS = {
  getClerkUsers: (api: AxiosInstance, queryParams: TIndexQueryParams) => {
    return queryOptions({
      queryKey: ["clerk-users", queryParams],
      queryFn: async (): Promise<TPaginationResponse<TClerkUser>> => {
        return await api.get("/users", {
          params: queryParams,
        });
      },
    });
  },
};
