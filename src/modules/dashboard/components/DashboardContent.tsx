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

export function DashboardContent() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { fetchAll, loading: dashboardLoading } = useDashboardStore();

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return (
        <div className="min-h-screen p-8 bg-neutral-950 text-neutral-200">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-neutral-500">Welcome, {user?.name}</p>
                </div>

                <Button
                    className="max-w-40"
                    variant="danger"
                    onClick={async () => {
                        await logout();
                        router.push("/login");
                    }}
                >
                    Logout
                </Button>
            </div>

            {dashboardLoading ? (
                <div className="flex justify-center items-center h-screen text-neutral-400">
                    Loading dashboard...
                </div>
            ) : (
                <>
                    <SummaryCards />
                    <RecentActivity />
                    <ChartsSection />
                    <TopCategories />
                    <Categories />
                </>
            )}
        </div>
    );
}
