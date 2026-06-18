"use client";

import { MonthlyReviewStatus } from "../../schemas/ai.schemas";

const statusStyles: Record<MonthlyReviewStatus, string> = {
    PENDING: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    PROCESSING: "border-sky-500/40 bg-sky-500/10 text-sky-200",
    COMPLETED: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    FAILED: "border-rose-500/40 bg-rose-500/10 text-rose-200",
    INSUFFICIENT_DATA:
        "border-neutral-500/40 bg-neutral-700/30 text-neutral-200",
};

const statusLabels: Record<MonthlyReviewStatus, string> = {
    PENDING: "Queued",
    PROCESSING: "Processing",
    COMPLETED: "Completed",
    FAILED: "Failed",
    INSUFFICIENT_DATA: "Insufficient data",
};

type MonthlyReviewStatusBadgeProps = {
    status: MonthlyReviewStatus;
};

export function MonthlyReviewStatusBadge({
    status,
}: MonthlyReviewStatusBadgeProps) {
    return (
        <span
            className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
        >
            {statusLabels[status]}
        </span>
    );
}
