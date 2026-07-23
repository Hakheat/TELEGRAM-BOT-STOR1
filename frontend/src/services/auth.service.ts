import { apiClient } from "@/lib/api-client";
import { UserProfile, LoginResponse } from "@/types/auth.types";

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>("/auth/login", { username, password });
    if (res.data?.access_token && typeof window !== "undefined") {
      localStorage.setItem("access_token", res.data.access_token);
      document.cookie = `access_token=Bearer ${res.data.access_token}; path=/; max-age=2592000`;
    }
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  },

  async getMe(): Promise<UserProfile> {
    const res = await apiClient.get<UserProfile>("/auth/me");
    return res.data;
  },
};

