"use client";
import { useDashboardStore } from "../store/dashboard.store";

export function TopCategories() {
    const { topCategories } = useDashboardStore();

    if (!topCategories?.length) return null;

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mt-6">
            <h2 className="text-lg font-semibold mb-4 text-neutral-100">
                Top Spending Categories
            </h2>
            <ul className="space-y-2">
                {topCategories.map((c) => (
                    <li
                        key={c.category}
                        className="flex justify-between text-neutral-300 text-sm border-b border-neutral-800 pb-1"
                    >
                        <span>{c.category}</span>
                        <span className="text-neutral-400">₹{c.total}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
