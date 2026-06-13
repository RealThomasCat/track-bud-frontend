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

// All dashboard sections that are fetched independently.
type DashboardWidgetKey =
    | "summary"
    | "recentActivity"
    | "topCategories"
    | "charts";

// Dashboard store state and actions.
type DashboardState = {
    summary: DashboardSummary | null;
    recentActivity: DashboardTransaction[];
    topCategories: DashboardTopCategory[];
    charts: DashboardChart | null;
    loading: boolean;
    hasLoaded: boolean;
    error: string | null;
    widgetErrors: Partial<Record<DashboardWidgetKey, string>>; // Per-widget errors, so one failed section does not break the full dashboard.

    fetchAll: () => Promise<void>;
    reset: () => void;
};

// Maps each dashboard widget to its own API fetch function.
const dashboardFetchers = {
    summary: () => DashboardService.getSummary(),
    recentActivity: () => DashboardService.getRecentActivity({ limit: 5 }),
    topCategories: () => DashboardService.getTopCategories({ limit: 5 }),
    charts: () => DashboardService.getCharts(),
} satisfies Record<DashboardWidgetKey, () => Promise<unknown>>;

// Converts per-widget errors into one dashboard-level message.
function buildDashboardError(
    widgetErrors: Partial<Record<DashboardWidgetKey, string>>,
) {
    // Count how many dashboard widgets failed.
    const failedCount = Object.keys(widgetErrors).length;

    // No widget failed, so there is no global dashboard error.
    if (failedCount === 0) return null;

    // If one widget failed, show its exact error; otherwise show a generic message.
    return failedCount === 1
        ? (Object.values(widgetErrors)[0] ?? null)
        : "Some dashboard sections could not be refreshed. Please retry.";
}

// Dashboard store.
export const useDashboardStore = create<DashboardState>((set) => ({
    // Initial dashboard state before any fetch.
    summary: null,
    recentActivity: [],
    topCategories: [],
    charts: null,
    loading: false,
    hasLoaded: false,
    error: null,
    widgetErrors: {},

    // Action to fetch all dashboard widgets.
    fetchAll: async () => {
        // Show full loading only before the first successful/failed load.
        set((state) => ({
            loading: !state.hasLoaded,
            error: null,
            widgetErrors: {},
        }));

        // Convert fetcher object into ordered entries: [widgetKey, fetchFunction].
        const entries = Object.entries(dashboardFetchers) as [
            DashboardWidgetKey,
            () => Promise<unknown>,
        ][];

        // Run all dashboard requests in parallel and keep both successes and failures.
        const results = await Promise.allSettled(
            entries.map(([, fetcher]) => fetcher()),
        );

        // Build the next store update in one object before calling set().
        const nextState: Partial<DashboardState> = {
            hasLoaded: true,
            loading: false,
            widgetErrors: {},
        };

        // Match each result back to its dashboard widget key using the same index.
        results.forEach((result, index) => {
            const key = entries[index][0];

            // If the fetch was successful, store the widget data in the correct state field.
            if (result.status === "fulfilled") {
                if (key === "summary") {
                    nextState.summary = result.value as DashboardSummary;
                }

                if (key === "recentActivity") {
                    nextState.recentActivity =
                        result.value as DashboardTransaction[];
                }

                if (key === "topCategories") {
                    nextState.topCategories =
                        result.value as DashboardTopCategory[];
                }

                if (key === "charts") {
                    nextState.charts = result.value as DashboardChart;
                }

                return;
            }

            // Store failed widget error without removing successful widget data.
            nextState.widgetErrors = {
                ...nextState.widgetErrors,
                [key]: extractErrorMessage(result.reason),
            };
        });

        // Create one dashboard-level error message from all widget errors.
        nextState.error = buildDashboardError(nextState.widgetErrors ?? {});

        // Apply all dashboard updates together.
        set(nextState);
    },

    // Action to clear dashboard state.
    reset: () =>
        set({
            summary: null,
            recentActivity: [],
            topCategories: [],
            charts: null,
            loading: false,
            hasLoaded: false,
            error: null,
            widgetErrors: {},
        }),
}));
