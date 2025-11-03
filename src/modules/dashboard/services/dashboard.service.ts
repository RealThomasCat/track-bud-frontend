import { api } from "@/lib/axios";
import type {
    DashboardSummary,
    DashboardTransaction,
    DashboardTopCategory,
    DashboardChart,
} from "@/modules/dashboard/schemas/dashboard.schemas";
import { ApiResponse } from "@/types/apiResponse";

export const DashboardService = {
    async getSummary() {
        const res = await api.get<ApiResponse<{ summary: DashboardSummary }>>(
            "/dashboard/summary"
        );
        return res.data.summary;
    },

    async getRecentActivity() {
        const res = await api.get<
            ApiResponse<{ recentActivity: DashboardTransaction[] }>
        >("/dashboard/recent-activity");
        return res.data.recentActivity;
    },

    async getTopCategories() {
        const res = await api.get<
            ApiResponse<{ topCategories: DashboardTopCategory[] }>
        >("/dashboard/top-categories");
        return res.data.topCategories;
    },

    async getCharts() {
        const res = await api.get<ApiResponse<{ charts: DashboardChart }>>(
            "/dashboard/charts"
        );
        return res.data.charts;
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
