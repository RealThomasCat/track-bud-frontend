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
import { DeleteTransactionDialog } from "./DeleteTransactionDialog";
import { extractErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { formatDate, formatSignedCurrency } from "@/lib/formatters";
import { useAuthStore } from "@/modules/auth/store/auth.store";

type Props = {
    open: boolean;
    onClose: () => void;
};

export function TransactionsModal({ open, onClose }: Props) {
    const currency = useAuthStore((state) => state.user?.defaultCurrency);
    const {
        categories,
        fetchAllCategories,
        error: categoryError,
    } = useCategoryStore();
    const {
        transactions,
        fetchAllTransactions,
        fetchNextTransactions,
        pagination,
        loading: transactionLoading,
        loadingMore,
        error: transactionError,
    } = useTransactionStore();

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [initializing, setInitializing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const load = async () => {
            setInitializing(true);
            setError(null);
            try {
                await fetchAllTransactions();
                if (!categories.length) {
                    await fetchAllCategories();
                }
            } catch (err) {
                setError(extractErrorMessage(err));
            } finally {
                setInitializing(false);
            }
        };

        load();
    }, [open, categories.length, fetchAllCategories, fetchAllTransactions]);

    const getCategoryName = (id: number) =>
        categories.find((c) => c.id === id)?.name ?? "Uncategorized";

    const isLoading = initializing || transactionLoading;
    const errorMessage = error ?? transactionError ?? categoryError;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-neutral-900 border border-neutral-800 w-full h-fit md:max-w-2xl! max-h-[80vh] overflow-hidden px-0! py-4 gap-2">
                <DialogHeader className="px-4">
                    <DialogTitle className="text-lg font-semibold text-neutral-100">
                        Transactions
                    </DialogTitle>
                </DialogHeader>

                <div className="overflow-y-scroll max-h-full px-4 scrollbar-hide">
                    {isLoading ? (
                        <p className="text-neutral-400 text-sm text-center">
                            Loading...
                        </p>
                    ) : errorMessage ? (
                        <div className="flex flex-col gap-3 items-center">
                            <p className="text-rose-500 text-sm py-2">
                                error {errorMessage}
                            </p>
                            <Button
                                variant="secondary"
                                className="max-w-28 mb-2"
                                onClick={async () => {
                                    setInitializing(true);
                                    setError(null);
                                    try {
                                        await fetchAllTransactions();
                                        if (!categories.length) {
                                            await fetchAllCategories();
                                        }
                                    } catch (err: unknown) {
                                        setError(extractErrorMessage(err));
                                    } finally {
                                        setInitializing(false);
                                    }
                                }}
                                disabled={isLoading}
                                loading={isLoading}
                            >
                                Retry
                            </Button>
                        </div>
                    ) : transactions.length ? (
                        <div className="flex flex-col gap-2">
                            <ul className="divide-y divide-neutral-800">
                                {transactions.map((txn) => (
                                    <li
                                        key={txn.id}
                                        className="flex justify-between items-center py-3 text-sm text-neutral-300"
                                    >
                                        <div>
                                            <p className="font-medium text-neutral-200">
                                                {getCategoryName(
                                                    txn.categoryId,
                                                )}
                                            </p>
                                            <p className="text-neutral-500 text-xs mt-0.5">
                                                {txn.note || "-"}
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
                                                {formatSignedCurrency(
                                                    txn.amount,
                                                    txn.kind,
                                                    currency,
                                                )}
                                            </span>

                                            <span className="text-neutral-500 text-xs">
                                                {formatDate(txn.occurredAt)}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    setDeleteId(txn.id)
                                                }
                                                className="text-neutral-500 hover:text-rose-500 transition"
                                                aria-label="Delete transaction"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {pagination?.hasNextPage && (
                                <Button
                                    variant="secondary"
                                    className="self-center max-w-32 mb-2"
                                    onClick={() => fetchNextTransactions()}
                                    disabled={loadingMore}
                                    loading={loadingMore}
                                >
                                    Load More
                                </Button>
                            )}
                        </div>
                    ) : (
                        <p className="text-neutral-400 text-sm text-center">
                            No transactions found.
                        </p>
                    )}
                </div>

                {deleteId && (
                    <DeleteTransactionDialog
                        transactionId={deleteId}
                        open={!!deleteId}
                        onClose={() => setDeleteId(null)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
