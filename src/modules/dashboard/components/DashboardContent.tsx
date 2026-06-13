"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard.store";

import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { SummaryCards } from "@/modules/dashboard/components/SummaryCards";
import { RecentActivity } from "@/modules/dashboard/components/RecentActivity";
import { ChartsSection } from "@/modules/dashboard/components/ChartsSection";
import { TopCategories } from "@/modules/dashboard/components/TopCategories";
import { Categories } from "@/modules/categories/components/Categories";
import { AiSpendingSummary } from "@/modules/ai/components/AiSpendingSummary";
import { AiSavingRecommendations } from "@/modules/ai/components/AiSavingRecommendations";
import { AiForecast } from "@/modules/ai/components/AiForcast";

export function DashboardContent() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const {
        fetchAll,
        hasLoaded: dashboardHasLoaded,
        summary,
        error,
        loading,
    } = useDashboardStore();

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const isReady = dashboardHasLoaded;
    const transactionCount = isReady && summary ? summary.transactionCount : 0;
    const hasTransactions = isReady && transactionCount > 0;
    const canUseAi = isReady && transactionCount >= 5;

    return (
        <div className="min-h-screen p-4 md:p-8 flex flex-col">
            <div className="flex flex-col mb-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-200">
                            Track<span className="text-emerald-500">Bud</span>
                        </h1>
                        {/* <p className="text-neutral-400">Welcome, {user?.name}</p> */}
                    </div>

                    <Button
                        className="max-w-40"
                        variant="secondary"
                        disabled={isLoggingOut}
                        loading={isLoggingOut}
                        onClick={async () => {
                            if (isLoggingOut) return;

                            setIsLoggingOut(true);
                            try {
                                await logout();
                                router.push("/login");
                            } finally {
                                setIsLoggingOut(false);
                            }
                        }}
                    >
                        Logout
                    </Button>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-lg text-neutral-100 font-semibold">
                        <span className="capitalize">
                            {user?.name?.split(" ")[0]}
                        </span>
                        &apos;s Dashboard
                    </h1>
                </div>
            </div>

            {/* Show dashboard loading only on first load */}
            {!dashboardHasLoaded ? (
                <div className="flex grow justify-center items-center text-neutral-400">
                    {" "}
                    Loading dashboard...{" "}
                </div>
            ) : error && !summary ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                    <h2 className="text-lg font-semibold text-neutral-100 mb-3">
                        Dashboard unavailable
                    </h2>
                    <FormError message={error} />
                    <Button
                        variant="secondary"
                        className="mt-4 max-w-32"
                        onClick={() => fetchAll()}
                        disabled={loading}
                        loading={loading}
                    >
                        Retry
                    </Button>
                </div>
            ) : (
                <>
                    <FormError message={error ?? undefined} className="mb-4" />
                    <SummaryCards />
                    <RecentActivity />

                    {/* AI SECTION */}
                    {canUseAi ? (
                        <div key={transactionCount}>
                            <AiSpendingSummary />
                            <AiSavingRecommendations />
                            <AiForecast />
                        </div>
                    ) : (
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mt-6">
                            <h2 className="text-lg font-semibold text-neutral-100">
                                AI Insights
                            </h2>
                            <p className="text-sm text-neutral-400 mt-2">
                                Add at least{" "}
                                <span className="text-neutral-200 font-medium">
                                    5 transactions
                                </span>{" "}
                                to unlock AI-powered insights like spending
                                summaries, savings recommendations, and
                                forecasts.
                            </p>
                        </div>
                    )}

                    {/* CHARTS & CATEGORIES */}
                    {hasTransactions && (
                        <>
                            <ChartsSection />
                            <TopCategories />
                        </>
                    )}

                    <Categories />
                </>
            )}
        </div>
    );
}
