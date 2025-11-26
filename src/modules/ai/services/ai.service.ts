import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";
import {
    AiResponse,
    ForecastData,
    SavingRecommendationsData,
    SpendingSummaryData,
} from "../schema/ai.schemas";

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
};
