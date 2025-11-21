"use client";

import { useState } from "react";
import { useDashboardStore } from "../store/dashboard.store";
import { Button } from "@/components/ui/Button";
import { AddTransactionDialog } from "@/modules/transactions/components/AddTransactionDialog";
import { TransactionsModal } from "@/modules/transactions/components/TransactionsModal";
import { useTransactionStore } from "@/modules/transactions/store/transaction.store";

export function RecentActivity() {
    const { recentActivity } = useDashboardStore();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showAllModal, setShowAllModal] = useState(false);

    const { addTransaction } = useTransactionStore();

    if (!recentActivity?.length) return null;

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mt-6">
            {/* HEADER WITH BUTTONS */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-neutral-100">
                    Recent Activity
                </h2>

                <div className="flex gap-3 max-w-80 w-full">
                    <Button
                        variant="secondary"
                        className="max-w-40"
                        onClick={() => setShowAllModal(true)}
                    >
                        View All
                    </Button>

                    <Button
                        variant="primary"
                        className="max-w-40"
                        onClick={() => setShowAddDialog(true)}
                    >
                        Add Transaction
                    </Button>
                </div>
            </div>

            {/* LIST */}
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
                                {txn.kind === "income" ? "+" : "-"}${txn.amount}
                            </p>
                            <p className="text-neutral-500 text-xs mt-0.5">
                                {new Date(txn.occurredAt).toLocaleDateString()}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Add Transaction Dialog */}
            {showAddDialog && (
                <AddTransactionDialog
                    open={showAddDialog}
                    onClose={() => setShowAddDialog(false)}
                    onTransactionCreated={addTransaction}
                />
            )}

            {/* Full Transactions Modal */}
            {showAllModal && (
                <TransactionsModal
                    open={showAllModal}
                    onClose={() => setShowAllModal(false)}
                />
            )}
        </div>
    );
}
