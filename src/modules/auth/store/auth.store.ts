"use client";
import { create } from "zustand";
import { AuthService } from "../services/auth.service";
import { AuthUser } from "../schemas/auth.schemas";

// Auth state type definition (state + actions)
type AuthState = {
    user: AuthUser | null;
    loading: boolean;
    setUser: (user: AuthUser | null) => void;
    fetchMe: () => Promise<void>;
    logout: () => Promise<void>;
};

// Creating a store function that returns useAuthStore hook that can both read and mutate auth state
export const useAuthStore = create<AuthState>((set) => ({
    // Initial state
    user: null,
    loading: false,

    // Action to set user
    setUser: (user) => set(() => ({ user })),

    // Action to fetch current user
    fetchMe: async () => {
        set({ loading: true });
        try {
            const user = await AuthService.me();
            set({ user });
        } catch {
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },

    // Action to logout user
    logout: async () => {
        set({ loading: true });
        try {
            await AuthService.logout();
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },
}));
