import { api } from "@/lib/axios";
import type {
    DashboardSummary,
    DashboardTransaction,
    DashboardTopCategory,
    DashboardChart,
} from "@/modules/dashboard/schemas/dashboard.schemas";

export const DashboardService = {
    async getSummary() {
        const res = await api.get<DashboardSummary>("/dashboard/summary");
        return res.data;
    },

    async getRecentActivity() {
        const res = await api.get<DashboardTransaction[]>(
            "/dashboard/recent-activity"
        );
        return res.data;
    },

    async getTopCategories() {
        const res = await api.get<DashboardTopCategory[]>(
            "/dashboard/top-categories"
        );
        return res.data;
    },

    async getCharts() {
        const res = await api.get<DashboardChart>("/dashboard/charts");
        return res.data;
    },

    async getAll() {
        const [summary, recentActivity, topCategories, charts] =
            await Promise.all([
                this.getSummary(),
                this.getRecentActivity(),
                this.getTopCategories(),
                this.getCharts(),
            ]);

        return { summary, recentActivity, topCategories, charts };
    },
};
