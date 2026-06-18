"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { formatCurrency } from "@/lib/formatters";
import {
    CompletedMonthlyReviewResult,
    InsufficientDataMonthlyReviewResult,
    MonthlyReview,
    MonthlyReviewKeyMetrics,
} from "../../schemas/ai.schemas";
import { MonthlyReviewStatusBadge } from "./MonthlyReviewStatusBadge";

type MonthlyReviewRendererProps = {
    review: MonthlyReview;
};

function formatPercent(value: number | null) {
    if (value === null || !Number.isFinite(value)) return "N/A";
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function isCompletedResult(
    review: MonthlyReview,
): review is MonthlyReview & { result: CompletedMonthlyReviewResult } {
    return review.status === "COMPLETED" && Boolean(review.result);
}

function isInsufficientDataResult(
    review: MonthlyReview,
): review is MonthlyReview & { result: InsufficientDataMonthlyReviewResult } {
    return review.status === "INSUFFICIENT_DATA" && Boolean(review.result);
}

function MetricGrid({ metrics }: { metrics: MonthlyReviewKeyMetrics }) {
    const currency = useAuthStore((state) => state.user?.defaultCurrency);
    const items = useMemo(
        () => [
            {
                label: "Income",
                value: formatCurrency(metrics.totalIncome, currency),
            },
            {
                label: "Expenses",
                value: formatCurrency(metrics.totalExpense, currency),
            },
            {
                label: "Net savings",
                value: formatCurrency(metrics.netSavings, currency),
            },
            {
                label: "Savings rate",
                value: formatPercent(metrics.savingsRate),
            },
            {
                label: "Expense ratio",
                value: formatPercent(metrics.expenseToIncomeRatio),
            },
            {
                label: "Transactions",
                value: String(metrics.transactionCount),
            },
        ],
        [currency, metrics],
    );

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
                <div
                    key={item.label}
                    className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4"
                >
                    <p className="text-[11px] font-semibold uppercase text-neutral-500">
                        {item.label}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-neutral-100">
                        {item.value}
                    </p>
                </div>
            ))}
        </div>
    );
}

function TextList({ items }: { items: string[] }) {
    if (!items.length) {
        return (
            <p className="text-sm leading-6 text-neutral-500">
                Nothing flagged.
            </p>
        );
    }

    return (
        <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-300">
            {items.map((item, index) => (
                <li
                    key={`${item}-${index}`}
                    className="leading-6 marker:text-neutral-600"
                >
                    {item}
                </li>
            ))}
        </ul>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase text-neutral-500">
                {title}
            </h3>
            {children}
        </section>
    );
}

export function MonthlyReviewRenderer({ review }: MonthlyReviewRendererProps) {
    const currency = useAuthStore((state) => state.user?.defaultCurrency);
    const dataQuality = review.dataQualityLevel ?? review.dataQuality ?? "N/A";

    if (isInsufficientDataResult(review)) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="min-w-0 text-lg font-semibold leading-7 tracking-normal text-neutral-100 sm:text-xl">
                            Not enough data yet
                        </h2>
                        <MonthlyReviewStatusBadge status={review.status} />
                    </div>
                    <p className="max-w-none text-sm leading-6 text-neutral-400">
                        The review service ran successfully, but this period
                        does not have enough transaction activity for a useful
                        monthly analysis.
                    </p>
                </div>

                <p className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4 text-sm font-medium leading-6 text-neutral-300">
                    {review.result.message}
                </p>

                <Section title="Minimum required data">
                    <p className="text-sm leading-6 text-neutral-300">
                        {review.result.minimumRule}
                    </p>
                </Section>

                <Section title="Current period metrics">
                    <MetricGrid metrics={review.result.keyMetrics} />
                </Section>
            </div>
        );
    }

    if (!isCompletedResult(review)) {
        return (
            <div className="space-y-4">
                <MonthlyReviewStatusBadge status={review.status} />
                <p className="text-sm leading-6 text-neutral-400">
                    This monthly review is not ready to display yet.
                </p>
            </div>
        );
    }

    const result = review.result;

    return (
        <div className="space-y-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold tracking-normal text-neutral-100">
                        Review highlights
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
                        A structured summary of this period&apos;s money
                        movement, risk signals, and recommended next actions.
                    </p>
                </div>
                <MonthlyReviewStatusBadge status={review.status} />
            </div>

            <Section title="Executive summary">
                <p className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4 text-sm leading-6 text-neutral-300">
                    {result.executiveSummary}
                </p>
            </Section>

            <Section title="Financial health">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-3xl font-bold text-emerald-300">
                                {result.financialHealthScore.score}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-neutral-200">
                                {result.financialHealthScore.label}
                            </p>
                        </div>
                        <p className="text-xs font-medium uppercase text-neutral-500">
                            Data quality: {dataQuality}
                        </p>
                    </div>
                    <div className="mt-4">
                        <TextList items={result.financialHealthScore.reasons} />
                    </div>
                </div>
            </Section>

            <Section title="Key metrics">
                <MetricGrid metrics={result.keyMetrics} />
            </Section>

            <Section title="Month-over-month comparison">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <p className="text-sm font-medium text-neutral-300">
                            Income:{" "}
                            {formatPercent(
                                result.comparison.incomeChangePercent,
                            )}
                        </p>
                        <p className="text-sm font-medium text-neutral-300">
                            Expenses:{" "}
                            {formatPercent(
                                result.comparison.expenseChangePercent,
                            )}
                        </p>
                        <p className="text-sm font-medium text-neutral-300">
                            Savings:{" "}
                            {formatPercent(
                                result.comparison.savingsChangePercent,
                            )}
                        </p>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-neutral-400">
                        {result.comparison.summary}
                    </p>
                </div>
            </Section>

            <Section title="Spending patterns">
                <TextList items={result.spendingBehaviorPatterns} />
            </Section>

            <Section title="Risk signals">
                <TextList items={result.unusualSpendingOrRiskSignals} />
            </Section>

            <Section title="Savings quality">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
                    <p className="text-sm font-semibold text-neutral-200">
                        {result.savingsQuality.rating}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-400">
                        {result.savingsQuality.summary}
                    </p>
                </div>
            </Section>

            <Section title="Suggested budget targets">
                {result.suggestedBudgetTargets.length ? (
                    <div className="space-y-3">
                        {result.suggestedBudgetTargets.map((target) => (
                            <div
                                key={`${target.category}-${target.suggestedLimit}`}
                                className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4"
                            >
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm font-semibold text-neutral-100">
                                        {target.category}
                                    </p>
                                    <p className="text-sm font-semibold text-emerald-300">
                                        {formatCurrency(
                                            target.suggestedLimit,
                                            currency,
                                        )}
                                    </p>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-neutral-400">
                                    {target.reason}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-neutral-500">
                        No budget target changes suggested.
                    </p>
                )}
            </Section>

            <Section title="Next month action plan">
                <TextList items={result.nextMonthActionPlan} />
            </Section>
        </div>
    );
}
