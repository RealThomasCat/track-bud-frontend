"use client";
import { useEffect } from "react";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard.store";

export default function DashboardDebug() {
    const {
        summary,
        recentActivity,
        topCategories,
        charts,
        loading,
        error,
        fetchAll,
    } = useDashboardStore();

    // Fetch dashboard data on mount
    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    if (loading) {
        return (
            <div className="p-4 text-gray-300">
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-400">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="m-6 space-y-6 text-gray-100">
            <section className="border border-gray-700 p-4 rounded-xl bg-gray-800">
                <h2 className="text-lg font-semibold mb-2">Summary</h2>
                <pre className="bg-gray-900 p-3 rounded-md overflow-auto text-sm text-gray-200">
                    {JSON.stringify(summary, null, 2)}
                </pre>
            </section>

            <section className="border border-gray-700 p-4 rounded-xl bg-gray-800">
                <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
                <pre className="bg-gray-900 p-3 rounded-md overflow-auto text-sm text-gray-200">
                    {JSON.stringify(recentActivity, null, 2)}
                </pre>
            </section>

            <section className="border border-gray-700 p-4 rounded-xl bg-gray-800">
                <h2 className="text-lg font-semibold mb-2">Top Categories</h2>
                <pre className="bg-gray-900 p-3 rounded-md overflow-auto text-sm text-gray-200">
                    {JSON.stringify(topCategories, null, 2)}
                </pre>
            </section>

            <section className="border border-gray-700 p-4 rounded-xl bg-gray-800">
                <h2 className="text-lg font-semibold mb-2">Charts</h2>
                <pre className="bg-gray-900 p-3 rounded-md overflow-auto text-sm text-gray-200">
                    {JSON.stringify(charts, null, 2)}
                </pre>
            </section>
        </div>
    );
}
