import { api } from "@/lib/axios";
import { LoginInput, SignupInput } from "@/modules/auth/schemas/auth.schemas";

// This file exports typed functions that perform API calls for auth domain

export const AuthService = {
    async login(data: LoginInput) {
        const res = await api.post("/auth/login", data);
        return res.data.user;
    },

    async signup(data: SignupInput) {
        const res = await api.post("/auth/signup", data);
        return res.data;
    },

    async logout() {
        await api.post("/auth/logout");
    },

    async me() {
        const res = await api.get("/auth/me");
        return res.data.user;
    },
};
