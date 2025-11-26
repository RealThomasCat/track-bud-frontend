// Specific AI output types (strict)
export type SpendingSummaryData = {
    summary: string;
    insights: string[];
};

export type SavingRecommendationsData = {
    tips: string[];
};

export type ForecastData = {
    forecastText: string;
    expectedChange: string;
};

// Generic shape returned by backend
export type AiResponse<T> = {
    rawText: string;
    data: T | null;
};
