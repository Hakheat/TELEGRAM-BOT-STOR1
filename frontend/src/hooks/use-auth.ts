import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { authService } from "@/services/auth.service";

export function useAuth() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      authService
        .getMe()
        .then((data) => setUser(data))
        .catch(() => logout());
    }
  }, [user, setUser, logout]);

  return { user, isAuthenticated, logout };
}
