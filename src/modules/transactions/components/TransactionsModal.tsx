"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useCategoryStore } from "@/modules/categories/store/category.store";
import { useTransactionStore } from "../store/transaction.store";
import { CategoryService } from "@/modules/categories/services/category.service";
import { TransactionService } from "../services/transaction.service";
import { DeleteTransactionDialog } from "./DeleteTransactionDialog";
import { extractErrorMessage } from "@/lib/utils";

type Props = {
    open: boolean;
    onClose: () => void;
};

export function TransactionsModal({ open, onClose }: Props) {
    const { categories, setCategories } = useCategoryStore();
    const { transactions, setTransactions, removeTransaction } =
        useTransactionStore();

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const txns = await TransactionService.getAll();
                setTransactions(txns);

                if (!categories.length) {
                    const cats = await CategoryService.getAll();
                    setCategories(cats);
                }
            } catch (err) {
                setError(extractErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [open, categories.length, setCategories, setTransactions]);

    const getCategoryName = (id: number) =>
        categories.find((c) => c.id === id)?.name ?? "Uncategorized";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-neutral-900 border border-neutral-800 w-full h-full max-w-2xl! max-h-[80vh] overflow-hidden px-0!">
                <DialogHeader className="px-4">
                    <DialogTitle className="text-lg font-semibold text-neutral-100">
                        All Transactions
                    </DialogTitle>
                </DialogHeader>

                <div className="overflow-y-scroll max-h-full px-4 mt-2 scrollbar-hide">
                    {loading ? (
                        <p className="text-neutral-400 text-sm">Loading...</p>
                    ) : error ? (
                        <p className="text-rose-500 text-sm">{error}</p>
                    ) : transactions.length ? (
                        <ul className="divide-y divide-neutral-800">
                            {transactions.map((txn) => (
                                <li
                                    key={txn.id}
                                    className="flex justify-between items-center py-3 text-sm text-neutral-300"
                                >
                                    <div>
                                        <p className="font-medium text-neutral-200">
                                            {getCategoryName(txn.categoryId)}
                                        </p>
                                        <p className="text-neutral-500 text-xs mt-0.5">
                                            {txn.note || "—"}
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
                                            {txn.amount}
                                        </span>

                                        <span className="text-neutral-500 text-xs">
                                            {new Date(
                                                txn.occurredAt
                                            ).toLocaleDateString()}
                                        </span>

                                        <button
                                            onClick={() => setDeleteId(txn.id)}
                                            className="text-neutral-500 hover:text-rose-500 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-neutral-400 text-sm">
                            No transactions found.
                        </p>
                    )}
                </div>

                {deleteId && (
                    <DeleteTransactionDialog
                        transactionId={deleteId}
                        open={!!deleteId}
                        onClose={() => setDeleteId(null)}
                        onTransactionDeleted={removeTransaction}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
