import { useEffect } from "react";
import session from "@/lib/utils/session";
import { useRouter } from "next/navigation";

const ACCESS_TOKEN_KEY = "access_token";

export const useAuthRedirect = (redirectTo = "/admin") => {
  const router = useRouter();

  useEffect(() => {
    const token = session.get(ACCESS_TOKEN_KEY);
    if (!token) {
      router.push(redirectTo);
    }
  }, [router, redirectTo]);
};