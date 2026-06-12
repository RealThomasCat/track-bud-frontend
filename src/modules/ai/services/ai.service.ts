import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";
import {
    AiResponse,
    ForecastData,
    MonthlyReview,
    MonthlyReviewCurrentData,
    SavingRecommendationsData,
    SpendingSummaryData,
} from "../schemas/ai.schemas";

export const AiService = {
    async getSpendingSummary(): Promise<AiResponse<SpendingSummaryData>> {
        const res = await api.get<ApiResponse<AiResponse<SpendingSummaryData>>>(
            "/ai/spending-summary"
        );
        return res.data;
    },

    async getSavingRecommendations(): Promise<
        AiResponse<SavingRecommendationsData>
    > {
        const res = await api.get<
            ApiResponse<AiResponse<SavingRecommendationsData>>
        >("/ai/saving-recommendations");
        return res.data;
    },

    async getForecast(): Promise<AiResponse<ForecastData>> {
        const res = await api.get<ApiResponse<AiResponse<ForecastData>>>(
            "/ai/forecast"
        );
        return res.data;
    },

    async generateMonthlyReview(): Promise<AiResponse<MonthlyReview>> {
        const res = await api.post<ApiResponse<AiResponse<MonthlyReview>>>(
            "/ai/monthly-review",
            {}
        );
        return res.data;
    },

    async getCurrentMonthlyReview(): Promise<
        AiResponse<MonthlyReviewCurrentData>
    > {
        const res = await api.get<
            ApiResponse<AiResponse<MonthlyReviewCurrentData>>
        >("/ai/monthly-review/current");
        return res.data;
    },

    async getMonthlyReviewById(id: number): Promise<AiResponse<MonthlyReview>> {
        const res = await api.get<ApiResponse<AiResponse<MonthlyReview>>>(
            `/ai/monthly-review/${id}`
        );
        return res.data;
    },
};
