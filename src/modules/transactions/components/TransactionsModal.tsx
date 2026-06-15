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
            <DialogContent className="flex max-h-[85vh] w-full flex-col gap-4 overflow-hidden border border-neutral-800 bg-neutral-900 px-0! pt-4 pb-6 sm:max-w-[calc(100%-2rem)] md:max-w-2xl!">
                <DialogHeader className="shrink-0 px-4">
                    <DialogTitle className="text-lg font-semibold text-neutral-100">
                        Transactions
                    </DialogTitle>
                </DialogHeader>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 scrollbar-hide">
                    {isLoading ? (
                        <p className="text-neutral-400 text-sm text-center">
                            Loading...
                        </p>
                    ) : errorMessage ? (
                        <div className="flex flex-col gap-4 items-center">
                            <p className="text-rose-500 text-sm ">
                                error {errorMessage}
                            </p>
                            <Button
                                variant="secondary"
                                className="max-w-28"
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
                        <div className="flex flex-col gap-4">
                            <ul className="divide-y divide-neutral-800">
                                {transactions.map((txn) => (
                                    <li
                                        key={txn.id}
                                        className="flex flex-col gap-3 py-3 text-sm text-neutral-300 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-neutral-200">
                                                {getCategoryName(
                                                    txn.categoryId,
                                                )}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-neutral-500">
                                                {txn.note || ""}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-end">
                                            <div className="text-right">
                                                <p
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
                                                </p>
                                                <p className="mt-0.5 text-xs text-neutral-500">
                                                    {formatDate(
                                                        txn.occurredAt,
                                                    )}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    setDeleteId(txn.id)
                                                }
                                                className="rounded-md p-1 text-neutral-500 transition hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
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
                                    className="self-center max-w-32"
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
