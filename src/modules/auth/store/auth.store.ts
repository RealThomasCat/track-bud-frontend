"use client";

import { create } from "zustand";
import { AuthService } from "../services/auth.service";
import type { AuthUser } from "../schemas/auth.schemas";

// Auth State + Actions
type AuthState = {
    user: AuthUser | null;
    loading: boolean;

    setUser: (user: AuthUser | null) => void;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
    // Initial state
    user: null,
    loading: true,

    // Action to set user
    setUser: (user) => set(() => ({ user })),

    // Action to fetch current authenticated user
    // Called once on app load (in RootLayout).
    fetchUser: async () => {
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

    // Action to logout
    logout: async () => {
        set({ loading: true });
        try {
            await AuthService.logout();
            set({ user: null });
        } catch {
            // In case backend logout fails, still clear local state
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },
}));
