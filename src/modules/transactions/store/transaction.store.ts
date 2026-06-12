"use client";

import { create } from "zustand";
import { Transaction } from "../schemas/transaction.schemas";
import { TransactionService } from "../services/transaction.service";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard.store";
import { extractErrorMessage } from "@/lib/utils";

type TransactionState = {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;

    fetchAllTransactions: () => Promise<void>;
    addTransaction: (txn: Transaction) => Promise<void>;
    removeTransaction: (id: number) => Promise<void>;
    reset: () => void;
};

export const useTransactionStore = create<TransactionState>((set) => ({
    transactions: [],
    loading: false,
    error: null,

    // Fetch all transactions from the API
    fetchAllTransactions: async () => {
        set({ loading: true, error: null });
        try {
            const data = await TransactionService.getAll();
            set({ transactions: data });
        } catch (err: unknown) {
            set({ error: extractErrorMessage(err) });
        } finally {
            set({ loading: false });
        }
    },

    // Add a new transaction and sync dashboard store
    addTransaction: async (txn) => {
        set((s) => ({ transactions: [txn, ...s.transactions] }));
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
            loading: false,
            error: null,
        }),
}));
