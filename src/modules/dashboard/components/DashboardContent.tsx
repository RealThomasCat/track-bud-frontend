"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard.store";

import { Button } from "@/components/ui/Button";
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
    const { fetchAll, loading: dashboardLoading } = useDashboardStore();

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return (
        <div className="min-h-screen p-4 md:p-8">
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
                        onClick={async () => {
                            await logout();
                            router.push("/login");
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

                {/* <h1 className="text-lg font-semibold text-neutral-100">
                    Welcome to your dashboard, {user?.name}!
                </h1> */}
            </div>

            {dashboardLoading ? (
                <div className="flex justify-center items-center h-screen text-neutral-400">
                    Loading dashboard...
                </div>
            ) : (
                <>
                    <SummaryCards />
                    <RecentActivity />
                    <AiSpendingSummary />
                    <AiSavingRecommendations />
                    <AiForecast />
                    <ChartsSection />
                    <TopCategories />
                    <Categories />
                </>
            )}
        </div>
    );
}
