import env from "@/common/config/environtment";
import axios from "axios";

export const client = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isInterceptorSetup = false;

export const setupAuthInterceptor = (getToken: () => Promise<string | null>) => {
  if (isInterceptorSetup) return;

  client.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  isInterceptorSetup = true;
};
