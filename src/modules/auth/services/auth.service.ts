import { api } from "@/lib/axios";
import type {
    LoginInput,
    SignupInput,
    AuthUser,
} from "@/modules/auth/schemas/auth.schemas";

export const AuthService = {
    async login(data: LoginInput) {
        const res = await api.post<{ user: AuthUser }>("/auth/login", data);
        return res.data.user;
    },

    async signup(data: SignupInput) {
        const res = await api.post<{ user: AuthUser }>("/auth/signup", data);
        return res.data.user;
    },

    async logout() {
        await api.post("/auth/logout");
    },

    async me() {
        const res = await api.get<{ user: AuthUser }>("/auth/me");
        return res.data.user;
    },
};
