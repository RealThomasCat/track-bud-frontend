import { api } from "@/lib/axios";
import type {
    DashboardSummary,
    DashboardTransaction,
    DashboardTopCategory,
    DashboardChart,
} from "@/modules/dashboard/schemas/dashboard.schemas";
import { ApiResponse } from "@/types/apiResponse";

type DateRangeParams = {
    startDate?: string;
    endDate?: string;
};

type LimitParam = {
    limit?: number;
};

export const DashboardService = {
    // DASHBOARD SUMMARY
    async getSummary(params?: DateRangeParams) {
        const res = await api.get<ApiResponse<{ summary: DashboardSummary }>>(
            "/dashboard/summary",
            { params }
        );
        return res.data.summary;
    },

    // RECENT ACTIVITY
    async getRecentActivity(params?: LimitParam) {
        const res = await api.get<
            ApiResponse<{ recentActivity: DashboardTransaction[] }>
        >("/dashboard/recent-activity", { params });
        return res.data.recentActivity;
    },

    // TOP CATEGORIES
    async getTopCategories(params?: DateRangeParams & LimitParam) {
        const res = await api.get<
            ApiResponse<{ topCategories: DashboardTopCategory[] }>
        >("/dashboard/top-categories", { params });
        return res.data.topCategories;
    },

    // DASHBOARD CHARTS
    async getCharts(params?: DateRangeParams) {
        const res = await api.get<ApiResponse<{ charts: DashboardChart }>>(
            "/dashboard/charts",
            { params }
        );
        return res.data.charts;
    },

    // GET ALL DASHBOARD DATA
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
