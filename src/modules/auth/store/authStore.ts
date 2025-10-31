"use client";
import { create } from "zustand";
import { AuthService } from "../services/auth.service";

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
            const user = await AuthService.me();
            set({ user });
        } catch {
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },

    // Action to log out the user
    logout: async () => {
        await AuthService.logout();
        set({ user: null });
    },
}));
