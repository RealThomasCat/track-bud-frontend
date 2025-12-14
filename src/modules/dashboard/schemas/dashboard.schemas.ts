// Typed API response shapes

export type DashboardSummary = {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
};

export type DashboardTransaction = {
    id: number;
    amount: number;
    kind: "income" | "expense";
    category: string;
    occurredAt: string;
    note?: string | null;
};

export type DashboardTopCategory = {
    category: string;
    total: number;
};

export type DashboardChart = {
    byCategory: { category: string; total: number }[];
    byMonth: { month: string; income: number; expense: number }[];
};
