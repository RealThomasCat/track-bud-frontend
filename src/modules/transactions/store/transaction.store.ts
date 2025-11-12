"use client";

import { create } from "zustand";
import { Transaction } from "../schemas/transaction.schemas";

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
    addTransaction: (transaction) =>
        set((state) => ({
            transactions: [transaction, ...state.transactions],
        })),

    // Action to remove transaction by ID
    removeTransaction: (id) =>
        set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
        })),
}));
