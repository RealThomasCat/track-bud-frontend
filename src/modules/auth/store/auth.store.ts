"use client";

import { create } from "zustand";
import { AuthService } from "../services/auth.service";
import type { AuthUser } from "../schemas/auth.schemas";
import { useCategoryStore } from "@/modules/categories/store/category.store";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard.store";
import { useTransactionStore } from "@/modules/transactions/store/transaction.store";

// Clears all user-specific stores when the auth user changes or logs out.
function resetUserStores() {
    useDashboardStore.getState().reset();
    useCategoryStore.getState().reset();
    useTransactionStore.getState().reset();
}

// Auth store state and actions.
type AuthState = {
    user: AuthUser | null;
    loading: boolean;

    setUser: (user: AuthUser | null) => void;
    clearSession: () => void;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
    // Initial auth state before /auth/me finishes.
    user: null,
    loading: true,

    // Sets the current user and handles session changes.
    setUser: (user) =>
        set((state) => {
            // Detect login as a different user in the same browser session.
            const isUserSwitch =
                Boolean(state.user && user) && state.user?.id !== user?.id;

            // Reset user-specific data on logout or user switch.
            if (!user || isUserSwitch) {
                resetUserStores();
            }

            return { user };
        }),

    // Clears the current session without making backend calls (used on frontend-only logout).
    clearSession: () => {
        resetUserStores();
        set({ user: null, loading: false });
    },

    // Fetches the current user from the backend and updates the auth state.
    fetchUser: async () => {
        set({ loading: true });

        try {
            const user = await AuthService.me();

            set((state) => {
                // If the restored user is different, clear old user-owned data.
                if (state.user && state.user.id !== user.id) {
                    resetUserStores();
                }

                return { user };
            });
        } catch {
            resetUserStores();
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },

    // Logs out the user by clearing the session on both frontend and backend.
    logout: async () => {
        set({ loading: true });

        try {
            await AuthService.logout();
        } catch {
            // Even if backend logout fails, local session must still be cleared.
        } finally {
            resetUserStores();
            set({ user: null, loading: false });
        }
    },
}));
