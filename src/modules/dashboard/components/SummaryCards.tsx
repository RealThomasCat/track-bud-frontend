"use client";
import { useDashboardStore } from "../store/dashboard.store";

export function SummaryCards() {
    const { summary } = useDashboardStore();

    if (!summary) return null;

    const cards = [
        { label: "Balance", value: summary.balance, color: "text-blue-400" },
        {
            label: "Total Income",
            value: summary.totalIncome,
            color: "text-emerald-400",
        },
        {
            label: "Total Expense",
            value: summary.totalExpense,
            color: "text-rose-400",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cards.map((c) => (
                <div
                    key={c.label}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-md"
                >
                    <p className="text-sm text-neutral-400">{c.label}</p>
                    <p className={`text-2xl font-semibold ${c.color}`}>
                        {c.value.toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}
