"use client";
import { create } from "zustand";
import { api } from "@/lib/axios";

// User type definition
type User = {
    id: number;
    name: string;
    email: string;
    defaultCurrency: string;
};

// Auth state type definition (state + actions)
type AuthState = {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    fetchMe: () => Promise<void>;
    logout: () => Promise<void>;
};

// Creating a store function that returns useAuthStore hook that can both read and mutate auth state
export const useAuthStore = create<AuthState>((set) => ({
    // Initial state
    user: null,
    loading: false,

    // Action to set the user
    setUser: (user) => set({ user }),

    // Action to fetch the current authenticated user
    fetchMe: async () => {
        set({ loading: true });

        try {
            const res = await api.get("/auth/me");
            set({ user: res.data.user });
        } catch {
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },

    // Action to log out the user
    logout: async () => {
        await api.post("/auth/logout");
        set({ user: null });
    },
}));
