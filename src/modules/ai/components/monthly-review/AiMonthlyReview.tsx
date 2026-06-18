"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FormError } from "@/components/ui/FormError";
import { extractErrorMessage } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";
import { AiSectionCard } from "../AiSectionCard";
import { AiService } from "../../services/ai.service";
import {
    MonthlyReview,
    MonthlyReviewCurrentData,
} from "../../schemas/ai.schemas";
import { MonthlyReviewRenderer } from "./MonthlyReviewRenderer";
import { MonthlyReviewStatusBadge } from "./MonthlyReviewStatusBadge";

// Polling interval for checking review status while it's active (PENDING or PROCESSING)
const POLL_INTERVAL_MS = 8000;

// Helper function to format the review period for display.
function formatReviewPeriod(start: string, end: string) {
    const endDate = new Date(end);

    if (!Number.isNaN(endDate.getTime())) {
        endDate.setDate(endDate.getDate() - 1);
        return `${formatDate(start)} - ${formatDate(endDate)}`;
    }

    return `${formatDate(start)} - ${formatDate(end)}`;
}

// Helper function to determine if the review is currently active (PENDING or PROCESSING).
function isActiveReview(review: MonthlyReview | null) {
    return review?.status === "PENDING" || review?.status === "PROCESSING";
}

// Helper function to get the appropriate status message based on the review's status.
function getStatusMessage(review: MonthlyReview | null) {
    if (!review) return "No monthly review generated for this period yet.";

    switch (review.status) {
        case "PENDING":
            return "Your monthly review is queued. This page will check again shortly.";
        case "PROCESSING":
            return "Your monthly review is processing. This page will check again shortly.";
        case "COMPLETED":
            return "Your monthly review is ready.";
        case "FAILED":
            return (
                review.errorMessage ||
                "The monthly review failed. You can try generating it again."
            );
        case "INSUFFICIENT_DATA":
            return "There is not enough data to produce a full monthly review yet.";
        default:
            return "Monthly review status is unavailable.";
    }
}

// Review can be opened if it's completed or if it failed due to insufficient data (to show the message about missing data)
function canOpenReview(review: MonthlyReview | null) {
    return (
        review?.status === "COMPLETED" || review?.status === "INSUFFICIENT_DATA"
    );
}

function canGenerateReview(review: MonthlyReview | null) {
    return (
        !review ||
        review.status === "FAILED" ||
        review.status === "INSUFFICIENT_DATA"
    );
}

export function AiMonthlyReview() {
    const [currentData, setCurrentData] =
        useState<MonthlyReviewCurrentData | null>(null); // Stores the backend response from current monthy review endpoint.
    const [review, setReview] = useState<MonthlyReview | null>(null); // Stores the actual review object.
    const [loadingCurrent, setLoadingCurrent] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [polling, setPolling] = useState(false); // Tracks whether we're currently polling for review status updates.
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // useRef creates an object like this: { current: false }
    // Changing mountedRef.current does not cause a re-render unlike useState would.
    // This ref is being used as a small internal flag, tells us whether the component (AiMonthlyReview) is currently mounted.
    // This component is complex, has polling, review generation may take a while, multiple async calls,
    // so we make this component more robust by checking if it's still mounted before updating state.
    const mountedRef = useRef(false);

    // Function to load the current monthly review, used on initial load and for polling.
    // Make the function stable with useCallback because its used as a dependency in useEffects.
    const loadCurrent = useCallback(async () => {
        const res = await AiService.getCurrentMonthlyReview();

        // If the component is no longer mounted by the time we get the response, stop here.
        // Do not update state.
        if (!mountedRef.current) return null;

        setCurrentData(res.data);
        setReview(res.data?.review ?? null);
        return res.data?.review ?? null;
    }, []);

    // Load the current monthly review on component mount.
    useEffect(() => {
        // Set the mountedRef to true when the component is mounted.
        mountedRef.current = true;

        // Function to load the initial review data.
        async function loadInitialReview() {
            try {
                setLoadingCurrent(true);
                setError(null);
                await loadCurrent();
            } catch (err: unknown) {
                if (mountedRef.current) setError(extractErrorMessage(err));
            } finally {
                if (mountedRef.current) setLoadingCurrent(false);
            }
        }

        // Call the function to load the initial review data.
        loadInitialReview();

        // Cleanup function to set the mountedRef to false when the component is unmounted.
        // React automatically runs this returned function when the component unmounts.
        return () => {
            mountedRef.current = false;
        };
    }, [loadCurrent]);

    // Poll for review status updates if there's an active review (PENDING or PROCESSING).
    useEffect(() => {
        if (
            !review ||
            (review.status !== "PENDING" && review.status !== "PROCESSING")
        ) {
            return;
        }

        const reviewToPoll = review;

        // Every POLL_INTERVAL_MS milliseconds, call the API to get the latest review data.
        const intervalId = window.setInterval(async () => {
            try {
                setPolling(true);
                setError(null);

                // If review has an id, fetch that specific review by id,
                // else fetch current monthly review (this is a fallback, ideally review should always have an id).
                const nextReview = reviewToPoll.id
                    ? (await AiService.getMonthlyReviewById(reviewToPoll.id))
                          .data
                    : await loadCurrent();

                // If the component is no longer mounted by the time we get the polling response, stop here.
                if (!mountedRef.current) return;

                if (nextReview) {
                    setReview(nextReview);
                }
            } catch (err: unknown) {
                if (mountedRef.current) setError(extractErrorMessage(err));
            } finally {
                if (mountedRef.current) setPolling(false);
            }
        }, POLL_INTERVAL_MS);

        // Cleanup function to clear the polling interval when the component unmounts or when dependencies change.
        return () => window.clearInterval(intervalId);
    }, [loadCurrent, review]);

    // Function to generate a new monthly review
    const generate = async () => {
        if (generating || isActiveReview(review) || !canGenerateReview(review))
            return;

        try {
            setGenerating(true);
            setError(null);

            const res = await AiService.generateMonthlyReview();

            if (!mountedRef.current) return;

            setReview(res.data);
            setIsOpen(false);
        } catch (err: unknown) {
            if (mountedRef.current) {
                setError(extractErrorMessage(err));
            }
        } finally {
            if (mountedRef.current) {
                setGenerating(false);
            }
        }
    };

    // Determine the label to display for the target period of the review.
    const targetPeriodLabel = useMemo(() => {
        if (currentData?.targetPeriod.title) {
            return currentData.targetPeriod.title;
        }

        if (review?.title) {
            return review.title;
        }

        if (currentData?.targetPeriod) {
            return formatReviewPeriod(
                currentData.targetPeriod.periodStart,
                currentData.targetPeriod.periodEnd,
            );
        }

        if (review) {
            return formatReviewPeriod(review.periodStart, review.periodEnd);
        }

        return null;
    }, [currentData, review]);

    const isBusy = loadingCurrent || generating || polling;
    const activeReview = isActiveReview(review);
    const showGenerateAction =
        !loadingCurrent && !activeReview && canGenerateReview(review);
    const actionLabel =
        review?.status === "FAILED" || review?.status === "INSUFFICIENT_DATA"
            ? "Retry"
            : "Generate";

    return (
        <AiSectionCard
            title="Monthly AI Review"
            description="Generate a month-end analysis of your income, expenses, savings quality, and next actions."
            loading={generating}
            onGenerate={generate}
            actionLabel={actionLabel}
            showAction={showGenerateAction}
            error={error}
        >
            {loadingCurrent ? (
                <p className="text-sm text-neutral-400">
                    Loading monthly review...
                </p>
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-col gap-3 rounded-lg border border-neutral-800 bg-neutral-950/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            {/* Target period */}
                            <p className="text-sm font-medium text-neutral-100">
                                {targetPeriodLabel ?? "Current month"}
                            </p>
                            {/* Status message */}
                            <p className="mt-1 text-sm leading-5 text-neutral-400">
                                {getStatusMessage(review)}
                            </p>
                        </div>

                        {/* Review status badge */}
                        {review && (
                            <MonthlyReviewStatusBadge status={review.status} />
                        )}
                    </div>

                    {/* Display spinner and status text when review is active (PENDING or PROCESSING) */}
                    {activeReview && (
                        <div className="flex items-center gap-2 text-sm text-neutral-400">
                            <RefreshCw className="size-4 animate-spin text-emerald-400" />
                            {polling
                                ? "Checking for updates..."
                                : "Waiting for the next status check..."}
                        </div>
                    )}

                    {/* Error message for failed reviews */}
                    {review?.status === "FAILED" && review.errorMessage && (
                        <FormError message={review.errorMessage} />
                    )}

                    {/* View review button */}
                    {canOpenReview(review) && (
                        <Button
                            type="button"
                            variant="secondary"
                            className="sm:max-w-48"
                            onClick={() => setIsOpen(true)}
                            disabled={isBusy}
                        >
                            <span className="inline-flex items-center justify-center gap-2">
                                <Eye className="size-4" />
                                View review
                            </span>
                        </Button>
                    )}
                </div>
            )}

            {/* Monthly review dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-[88vh] overflow-hidden p-0 sm:max-w-4xl gap-0">
                    <DialogHeader className="border-b border-neutral-800 px-6 pb-5 pt-6 pr-12">
                        <DialogTitle className="text-xl font-semibold tracking-normal text-neutral-100">
                            Monthly AI Review
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium text-neutral-400">
                            {targetPeriodLabel ??
                                "Review details for the current target period."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[72vh] overflow-y-auto px-6 py-5">
                        {review ? (
                            <MonthlyReviewRenderer review={review} />
                        ) : (
                            <p className="text-sm text-neutral-400">
                                No monthly review is available.
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AiSectionCard>
    );
}
