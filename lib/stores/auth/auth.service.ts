import API from "@/lib/utils/API";
import { ProcessError } from "@/lib/utils/Error";
import session from "@/lib/utils/session";
import { AuthFormData } from "@/lib/validators/auth";

const login = async (payload: AuthFormData) => {
    const { data } = await API.post("/auth/login", payload)
    return data;
}

const signup = async (payload: AuthFormData) => {
    const { data } = await API.post(
        "/auth/register", {
            email: payload.email,
            password: payload.password,
            is_superuser: true,
        }
    )
    return data;
}

const logout = async () => {
    const { data } = await API.post("/auth/logout")
    return data;
}

const refreshAccessToken = async () => {
    // Get token from session
    const access_token = session.get("access_token")

    if (access_token) {
        try {
            const { data } = await API.get("/auth/refresh-access-token")
            const response = data.data
            return response
        } catch (error) {
            ProcessError(error)
            return
        }
    }
}

export const authService = {
    login,
    signup,
    refreshAccessToken,
    logout,
}