import session from "../../utils/session";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth/auth";
import { authService } from "@/lib/stores/auth/auth.service";
import { userService } from "@/lib/stores/user/user.service";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const token = session.get("access_token");

    if (!token) {
      setIsAuthenticated(false);
      setUser(undefined);
      setLoading(false);
      return;
    }
    
    const loadUser = async () => {
      try {
        let fetchPromise = userService.getCurrentUser();
        const currentUser = await fetchPromise;
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (err) {
        const data = await authService.refreshAccessToken()
        session.set("access_token", data.access_token)
        loadUser()
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, isAuthenticated, loading };
};
