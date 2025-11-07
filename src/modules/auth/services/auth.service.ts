import { api } from "@/lib/axios";
import type {
    LoginInput,
    SignupInput,
    AuthUser,
} from "@/modules/auth/schemas/auth.schemas";
import { ApiResponse } from "@/types/apiResponse";

export const AuthService = {
    // LOGIN
    async login(data: LoginInput) {
        const res = await api.post<ApiResponse<{ user: AuthUser }>>(
            "/auth/login",
            data
        );
        return res.data.user;
    },

    // SIGNUP
    async signup(data: SignupInput) {
        const res = await api.post<ApiResponse<{ user: AuthUser }>>(
            "/auth/signup",
            data
        );
        return res.data.user;
    },

    // LOGOUT
    async logout() {
        const res = await api.post<ApiResponse<{ message: string }>>(
            "/auth/logout"
        );
        return res.data.message;
    },

    // GET CURRENT USER
    async me() {
        const res = await api.get<ApiResponse<{ user: AuthUser }>>("/auth/me");
        return res.data.user;
    },
};
