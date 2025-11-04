"use client";
import { useDashboardStore } from "../store/dashboard.store";

export function RecentActivity() {
    const { recentActivity } = useDashboardStore();

    if (!recentActivity?.length) return null;

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mt-6">
            <h2 className="text-lg font-semibold mb-4 text-neutral-100">
                Recent Activity
            </h2>
            <ul className="divide-y divide-neutral-800">
                {recentActivity.map((txn) => (
                    <li
                        key={txn.id}
                        className="flex justify-between py-2 text-sm text-neutral-300"
                    >
                        <div>
                            <p className="font-medium">{txn.category}</p>
                            <p className="text-neutral-500 text-xs">
                                {txn.note || "—"}
                            </p>
                        </div>
                        <div className="text-right">
                            <p
                                className={
                                    txn.kind === "income"
                                        ? "text-emerald-400 font-semibold"
                                        : "text-rose-400 font-semibold"
                                }
                            >
                                {txn.kind === "income" ? "+" : "-"}₹{txn.amount}
                            </p>
                            <p className="text-neutral-500 text-xs">
                                {new Date(txn.occurredAt).toLocaleDateString()}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
