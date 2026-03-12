"use client";

import { client } from "@/lib/axios";

export default function useAuthenticatedClient() {
  // const { getToken } = useAuth();

  // useEffect(() => {
  //   setupAuthInterceptor(getToken);
  // }, [getToken]);

  return client;
}
