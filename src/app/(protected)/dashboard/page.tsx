"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { Button } from "@/components/ui/Button";
import { SummaryCards } from "@/modules/dashboard/components/SummaryCards";
import { ChartsSection } from "@/modules/dashboard/components/ChartsSection";
import { TopCategories } from "@/modules/dashboard/components/TopCategories";
import { RecentActivity } from "@/modules/dashboard/components/RecentActivity";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard.store";
import { Categories } from "@/modules/categories/components/Categories";
import { Transactions } from "@/modules/transactions/components/Transactions";

export default function Dashboard() {
    const router = useRouter();

    // Access auth store values + actions
    const { user, loading: authLoading, fetchMe, logout } = useAuthStore();
    const { fetchAll, loading: dashboardLoading } = useDashboardStore();

    // First useEffect:
    // Runs once when component mounts.
    // Purpose: If user data is not already available (e.g., after reload),
    // call /auth/me to restore session.
    useEffect(() => {
        if (!user) {
            fetchMe();
        }
    }, [user, fetchMe]);

    // Second useEffect:
    // Runs whenever `loading` or `user` changes.
    // Purpose: If fetchMe has finished (`loading=false`) but still no user,
    // it means the session is invalid → redirect to /login.
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [authLoading, user, router]);

    // Third useEffect:
    // Runs whenever `user` changes.
    // Purpose: Once we have valid user data, fetch the dashboard data.
    useEffect(() => {
        if (user) {
            fetchAll();
        }
    }, [user, fetchAll]);

    // Show loading state while auth or dashboard data is being fetched
    if (authLoading || dashboardLoading || !user) {
        return (
            <div className="flex justify-center items-center h-screen text-neutral-400">
                Loading dashboard...
            </div>
        );
    }

    // Dashboard UI
    return (
        <div className="min-h-screen p-8 bg-neutral-950 text-neutral-200">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-neutral-500">Welcome, {user.name}</p>
                </div>

                <Button
                    className="max-w-40"
                    variant="primary"
                    onClick={async () => {
                        await logout();
                        router.push("/login");
                    }}
                >
                    Logout
                </Button>
            </div>

            <SummaryCards />
            <Transactions />
            <ChartsSection />
            <RecentActivity />
            <TopCategories />
            <Categories />
        </div>
    );
}
