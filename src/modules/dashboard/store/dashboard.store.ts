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
    hasLoaded: boolean;
    error: string | null;
    fetchAll: () => Promise<void>;
    applyTransactionOptimistic: (txn: DashboardTransaction) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
    summary: null,
    recentActivity: [],
    topCategories: [],
    charts: null,
    loading: false,
    hasLoaded: false,
    error: null,

    fetchAll: async () => {
        set((state) => ({
            loading: !state.hasLoaded, // only true on first load
            error: null,
        }));

        try {
            const data = await DashboardService.getAll();
            set({
                summary: data.summary,
                recentActivity: data.recentActivity,
                topCategories: data.topCategories,
                charts: data.charts,
                hasLoaded: true,
            });
        } catch (err: unknown) {
            set({ error: extractErrorMessage(err) });
        } finally {
            set({ loading: false });
        }
    },

    applyTransactionOptimistic: (txn: DashboardTransaction) => {
        set((state) => {
            const amount = Number(txn.amount);

            const summary = state.summary
                ? {
                      ...state.summary,
                      transactionCount: state.summary.transactionCount + 1,
                      totalIncome:
                          txn.kind === "income"
                              ? state.summary.totalIncome + amount
                              : state.summary.totalIncome,
                      totalExpense:
                          txn.kind === "expense"
                              ? state.summary.totalExpense + amount
                              : state.summary.totalExpense,
                  }
                : state.summary;

            return {
                summary,
                recentActivity: [txn, ...state.recentActivity],
            };
        });
    },
}));
