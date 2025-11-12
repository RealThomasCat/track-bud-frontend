"use client";

import { useEffect, useState } from "react";
import { AddTransactionDialog } from "./AddTransactionDialog";
import { DeleteTransactionDialog } from "./DeleteTransactionDialog";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import { useCategoryStore } from "@/modules/categories/store/category.store";
import { useTransactionStore } from "../store/transaction.store";
import { CategoryService } from "@/modules/categories/services/category.service";
import { TransactionService } from "../services/transaction.service";
import { extractErrorMessage } from "@/lib/utils";

export function Transactions() {
    const { categories, setCategories } = useCategoryStore();
    const { transactions, setTransactions, addTransaction, removeTransaction } =
        useTransactionStore();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Local UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch transactions + categories on mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch transactions
                const txns = await TransactionService.getAll();
                setTransactions(txns);

                // Fetch categories only if not cached
                if (!categories.length) {
                    const cats = await CategoryService.getAll();
                    setCategories(cats);
                }
            } catch (err: unknown) {
                setError(extractErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [setTransactions, setCategories, categories.length]);

    if (loading) {
        return (
            <p className="text-sm text-neutral-400">Loading transactions...</p>
        );
    }

    if (error) {
        return (
            <p className="text-sm text-rose-500">
                Failed to load transactions: {error}
            </p>
        );
    }

    const hasTransactions = transactions.length > 0;

    // Helper to get category name from categoryId
    const getCategoryName = (categoryId: number): string => {
        const cat = categories.find((c) => c.id === categoryId);
        return cat?.name ?? "Uncategorized";
    };

    const formatAmount = (amountStr: string): string => {
        const num = Number(amountStr);
        if (Number.isNaN(num)) return amountStr;
        return num.toLocaleString();
    };

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mt-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-100">
                    Your Transactions
                </h2>
                <Button
                    variant="primary"
                    onClick={() => setShowAddDialog(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white max-w-40"
                >
                    Add Transaction
                </Button>
            </div>

            {/* List */}
            {hasTransactions ? (
                <ul className="divide-y divide-neutral-800">
                    {transactions.map((txn) => {
                        const categoryName = getCategoryName(txn.categoryId);
                        const formattedAmount = formatAmount(txn.amount);
                        const note =
                            txn.note && txn.note.trim().length > 0
                                ? txn.note
                                : "—";

                        return (
                            <li
                                key={txn.id}
                                className="flex justify-between items-center py-3 text-sm text-neutral-300 hover:bg-neutral-800/40 px-2 rounded-lg transition"
                            >
                                <div>
                                    <p className="font-medium text-neutral-200">
                                        {categoryName}
                                    </p>
                                    <p className="text-neutral-500 text-xs mt-0.5">
                                        {note}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={
                                            txn.kind === "income"
                                                ? "text-emerald-400 font-semibold"
                                                : "text-rose-400 font-semibold"
                                        }
                                    >
                                        {txn.kind === "income" ? "+" : "-"}$
                                        {formattedAmount}
                                    </span>
                                    <span className="text-neutral-500 text-xs">
                                        {new Date(
                                            txn.occurredAt
                                        ).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => setDeleteId(txn.id)}
                                        title="Delete Transaction"
                                        className="text-neutral-500 hover:text-rose-500 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-neutral-400 text-sm">
                    No transactions yet. Add one to get started.
                </p>
            )}

            {/* Add Transaction Dialog */}
            {showAddDialog && (
                <AddTransactionDialog
                    open={showAddDialog}
                    onClose={() => setShowAddDialog(false)}
                    onTransactionCreated={addTransaction}
                />
            )}

            {/* Delete Transaction Dialog */}
            {deleteId && (
                <DeleteTransactionDialog
                    transactionId={deleteId}
                    open={!!deleteId}
                    onClose={() => setDeleteId(null)}
                    onTransactionDeleted={removeTransaction}
                />
            )}
        </div>
    );
}
