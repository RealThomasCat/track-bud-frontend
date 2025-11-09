"use client";
import { create } from "zustand";
import { DashboardService } from "../services/dashboard.service";
import type {
    DashboardSummary,
    DashboardTransaction,
    DashboardTopCategory,
    DashboardChart,
} from "../schemas/dashboard.schemas";
import { extractErrorMessage } from "@/lib/utils";

type DashboardState = {
    summary: DashboardSummary | null;
    recentActivity: DashboardTransaction[];
    topCategories: DashboardTopCategory[];
    charts: DashboardChart | null;
    loading: boolean;
    error: string | null;
    fetchAll: () => Promise<void>;
};

export const useDashboardStore = create<DashboardState>((set) => ({
    summary: null,
    recentActivity: [],
    topCategories: [],
    charts: null,
    loading: false,
    error: null,

    fetchAll: async () => {
        set({ loading: true, error: null });

        try {
            const data = await DashboardService.getAll();
            set({
                summary: data.summary,
                recentActivity: data.recentActivity,
                topCategories: data.topCategories,
                charts: data.charts,
            });
        } catch (err: unknown) {
            set({ error: extractErrorMessage(err) });
        } finally {
            set({ loading: false });
        }
    },
}));
