// Specific AI output types (strict)
export type SpendingSummaryData = {
    summary: string;
    insights: string[];
};

export type SavingRecommendationsData = {
    summary: string;
    tips: string[];
};

export type ForecastData = {
    forecastText: string;
    expectedChange: string;
};

export type MonthlyReviewStatus =
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED"
    | "INSUFFICIENT_DATA";

export type DataQualityLevel = "LOW" | "MEDIUM" | "HIGH";

export type FinancialHealthLabel = "LOW" | "FAIR" | "GOOD" | "STRONG";

export type MonthlyReviewPeriod = {
    periodStart: string;
    periodEnd: string;
    comparisonStart: string;
    comparisonEnd: string;
    title: string;
};

export type MonthlyReviewKeyMetrics = {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    savingsRate: number | null;
    expenseToIncomeRatio: number | null;
    transactionCount: number;
};

export type CompletedMonthlyReviewResult = {
    executiveSummary: string;
    financialHealthScore: {
        score: number;
        label: FinancialHealthLabel;
        reasons: string[];
    };
    keyMetrics: MonthlyReviewKeyMetrics;
    comparison: {
        incomeChangePercent: number | null;
        expenseChangePercent: number | null;
        savingsChangePercent: number | null;
        summary: string;
    };
    spendingBehaviorPatterns: string[];
    unusualSpendingOrRiskSignals: string[];
    savingsQuality: {
        summary: string;
        rating: DataQualityLevel;
    };
    suggestedBudgetTargets: Array<{
        category: string;
        suggestedLimit: number;
        reason: string;
    }>;
    nextMonthActionPlan: string[];
};

export type InsufficientDataMonthlyReviewResult = {
    reason: "INSUFFICIENT_DATA";
    message: string;
    minimumRule: string;
    keyMetrics: MonthlyReviewKeyMetrics;
};

export type MonthlyReviewResult =
    | CompletedMonthlyReviewResult
    | InsufficientDataMonthlyReviewResult
    | null;

export type MonthlyReview = {
    id: number;
    userId: number;
    status: MonthlyReviewStatus;
    periodStart: string;
    periodEnd: string;
    comparisonStart: string | null;
    comparisonEnd: string | null;
    title: string | null;
    dataQualityLevel: DataQualityLevel | null;
    transactionCount: number;
    result: MonthlyReviewResult;
    dataQuality?: DataQualityLevel | null;
    errorMessage: string | null;
    jobId: string | null;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
};

export type MonthlyReviewCurrentData = {
    review: MonthlyReview | null;
    targetPeriod: MonthlyReviewPeriod;
};

// Generic shape returned by backend
export type AiResponse<T> = {
    type: string;
    rawText?: string;
    data: T | null;
};
