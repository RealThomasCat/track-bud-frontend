"use client";

import { create } from "zustand";
import { Transaction } from "../schemas/transaction.schemas";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard.store";

type TransactionState = {
    transactions: Transaction[];
    setTransactions: (transactions: Transaction[]) => void;
    addTransaction: (transaction: Transaction) => void;
    removeTransaction: (id: number) => void;
};

export const useTransactionStore = create<TransactionState>((set) => ({
    // Initial State
    transactions: [],

    // Action to set transactions
    setTransactions: (transactions) => set({ transactions }),

    // Action to add transaction
    addTransaction: async (transaction) => {
        set((state) => ({
            transactions: [transaction, ...state.transactions],
        }));

        // Trigger dashboard refresh after addition
        const { fetchAll } = useDashboardStore.getState();
        await fetchAll();
    },

    // Action to remove transaction by ID
    removeTransaction: async (id) => {
        set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
        }));

        // Trigger dashboard refresh after deletion
        const { fetchAll } = useDashboardStore.getState();
        await fetchAll();
    },
}));
