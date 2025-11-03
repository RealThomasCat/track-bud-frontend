import { api } from "@/lib/axios";
import type {
    LoginInput,
    SignupInput,
    AuthUser,
} from "@/modules/auth/schemas/auth.schemas";
import { ApiResponse } from "@/types/apiResponse";

export const AuthService = {
    async login(data: LoginInput) {
        const res = await api.post<ApiResponse<{ user: AuthUser }>>(
            "/auth/login",
            data
        );
        return res.data.user;
    },

    async signup(data: SignupInput) {
        const res = await api.post<ApiResponse<{ user: AuthUser }>>(
            "/auth/signup",
            data
        );
        return res.data.user;
    },

    async logout() {
        const res = await api.post<ApiResponse<{ message: string }>>(
            "/auth/logout"
        );
        return res.data.message;
    },

    async me() {
        const res = await api.get<ApiResponse<{ user: AuthUser }>>("/auth/me");
        return res.data.user;
    },
};
