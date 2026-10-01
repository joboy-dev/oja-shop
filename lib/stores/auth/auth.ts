import { create } from "zustand";
import session from "@/lib/utils/session";
import toaster from "@/lib/utils/toaster";
import { authService } from "./auth.service";
import { ProcessError } from "@/lib/utils/Error";
import type { UserInterface } from "@/lib/interfaces/user";
import type { AuthFormData } from "@/lib/validators/auth";

interface AuthState {
    user?: UserInterface;
    isLoading: boolean;
    message: string;
    login: (payload: AuthFormData) => Promise<UserInterface | undefined>;
    signUp: (payload: AuthFormData) => Promise<UserInterface | undefined>;
    logout: () => Promise<void>;
    reset: () => void;
    setUser: (user: UserInterface | undefined) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: undefined,
    isLoading: false,
    message: "",

    login: async (payload: AuthFormData) => {
        set({ isLoading: true, message: "" });
        try {
            const response = await authService.login(payload);
            const data = response.data;
            session.set("access_token", data.access_token);
            toaster.success(response.message);

            // Redirect user
            window.location.href = "/admin/profile";
            set({ user: data.user, isLoading: false });
            return data.user;
        } catch (error) {
            ProcessError(error);
            set({
                user: undefined,
                isLoading: false,
                message: "An error occurred"
            });
            return undefined;
        }
    },

    signUp: async (payload: AuthFormData) => {
        set({ isLoading: true, message: "" });
        try {
            const response = await authService.signup(payload);
            const data = response.data;
            session.set("access_token", data.access_token);
            toaster.success(response.message);

            // Redirect user
            window.location.href = "/admin/profile";
            set({ user: data.user, isLoading: false });
            return data.user;
        } catch (error) {
            ProcessError(error);
            set({
                user: undefined,
                isLoading: false,
                message: "An error occurred"
            });
            return undefined;
        }
    },

    logout: async () => {
        set({ isLoading: true, message: "" });
        try {
            const response = await authService.logout();
            session.remove("access_token");
            toaster.success(response.message);
            set({ user: undefined, isLoading: false });
            window.location.href = "/admin";
        } catch (error) {
            ProcessError(error);
            set({ isLoading: false });
        }
    },

    reset: () => set({ isLoading: false, message: "" }),

    setUser: (user) => set({ user }),
}));
