"use client";

import { useState } from "react";
import { useDashboardStore } from "../store/dashboard.store";
import { Button } from "@/components/ui/Button";
import { AddTransactionDialog } from "@/modules/transactions/components/AddTransactionDialog";
import { TransactionsModal } from "@/modules/transactions/components/TransactionsModal";

export function RecentActivity() {
    const { recentActivity } = useDashboardStore();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showAllModal, setShowAllModal] = useState(false);

    const hasTransactions = !!recentActivity?.length;

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mt-6">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4 md:gap-0">
                <h2 className="text-lg font-semibold text-neutral-100">
                    Recent Activity
                </h2>

                <div className="flex flex-col-reverse md:flex-row gap-3 md:max-w-80 w-full">
                    <Button
                        variant="secondary"
                        className="md:max-w-40"
                        onClick={() => setShowAllModal(true)}
                        disabled={!hasTransactions}
                    >
                        View All
                    </Button>

                    <Button
                        variant="primary"
                        className="md:max-w-40"
                        onClick={() => setShowAddDialog(true)}
                    >
                        Add Transaction
                    </Button>
                </div>
            </div>

            {/* CONTENT */}
            {hasTransactions ? (
                <ul className="divide-y divide-neutral-800">
                    {recentActivity.map((txn) => (
                        <li
                            key={txn.id}
                            className="flex justify-between py-3 text-sm text-neutral-300"
                        >
                            <div>
                                <p className="font-medium">{txn.category}</p>
                                <p className="text-neutral-500 text-xs mt-0.5">
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
                                    {txn.kind === "income" ? "+" : "-"}$
                                    {txn.amount}
                                </p>
                                <p className="text-neutral-500 text-xs mt-0.5">
                                    {new Date(
                                        txn.occurredAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-neutral-400 text-sm mt-4">
                    No transactions yet. Add your first transaction to get
                    started.
                </p>
            )}

            {/* MODALS */}
            {showAddDialog && (
                <AddTransactionDialog
                    open={showAddDialog}
                    onClose={() => setShowAddDialog(false)}
                />
            )}

            {showAllModal && (
                <TransactionsModal
                    open={showAllModal}
                    onClose={() => setShowAllModal(false)}
                />
            )}
        </div>
    );
}
