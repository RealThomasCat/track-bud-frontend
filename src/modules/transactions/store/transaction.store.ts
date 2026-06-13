"use client";

import { create } from "zustand";
import {
    Transaction,
    TransactionPagination,
    TransactionQueryParams,
} from "../schemas/transaction.schemas";
import { TransactionService } from "../services/transaction.service";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard.store";
import { extractErrorMessage } from "@/lib/utils";

const TRANSACTION_PAGE_SIZE = 5;

type TransactionState = {
    transactions: Transaction[];
    pagination: TransactionPagination | null;
    loading: boolean;
    loadingMore: boolean;
    error: string | null;

    fetchAllTransactions: (
        params?: Omit<TransactionQueryParams, "cursor">,
    ) => Promise<void>;
    fetchNextTransactions: () => Promise<void>;
    addTransaction: (txn: Transaction) => Promise<void>;
    removeTransaction: (id: number) => Promise<void>;
    reset: () => void;
};

export const useTransactionStore = create<TransactionState>((set) => ({
    transactions: [],
    pagination: null,
    loading: false,
    loadingMore: false,
    error: null,

    // Fetch first transaction page from the API
    fetchAllTransactions: async (params) => {
        set({ loading: true, error: null });
        try {
            const data = await TransactionService.getAll({
                limit: TRANSACTION_PAGE_SIZE,
                ...params,
            });
            set({
                transactions: data.transactions,
                pagination: data.pagination,
            });
        } catch (err: unknown) {
            set({ error: extractErrorMessage(err) });
        } finally {
            set({ loading: false });
        }
    },

    // Fetch next transaction page using the backend cursor
    fetchNextTransactions: async () => {
        const { pagination, loadingMore } = useTransactionStore.getState();

        if (loadingMore || !pagination?.hasNextPage || !pagination.nextCursor) {
            return;
        }

        set({ loadingMore: true, error: null });
        try {
            const data = await TransactionService.getAll({
                limit: pagination.limit || TRANSACTION_PAGE_SIZE,
                cursor: pagination.nextCursor,
            });
            set((state) => ({
                transactions: [...state.transactions, ...data.transactions],
                pagination: data.pagination,
            }));
        } catch (err: unknown) {
            set({ error: extractErrorMessage(err) });
        } finally {
            set({ loadingMore: false });
        }
    },

    // Add a new transaction and sync dashboard store
    addTransaction: async (txn) => {
        set((state) => {
            return {
                transactions: [txn, ...state.transactions],
            };
        });
        await useDashboardStore.getState().fetchAll();
    },

    // Remove a transaction by ID and sync dashboard store
    removeTransaction: async (id) => {
        set((s) => ({
            transactions: s.transactions.filter((t) => t.id !== id),
        }));
        await useDashboardStore.getState().fetchAll();
    },

    reset: () =>
        set({
            transactions: [],
            pagination: null,
            loading: false,
            loadingMore: false,
            error: null,
        }),
}));
