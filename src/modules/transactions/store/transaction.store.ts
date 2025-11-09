"use client";

import { create } from "zustand";
import {
    CreateTransactionInput,
    DeleteTransactionInput,
    Transaction,
} from "../schemas/transaction.schemas";
import { TransactionService } from "../services/transaction.service";

// Type definition for Transaction Store
type TransactionState = {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;

    fetchTransactions: () => Promise<void>;
    fetchTransactionById: (id: number) => Promise<Transaction | null>;
    createTransaction: (data: CreateTransactionInput) => Promise<void>;
    deleteTransaction: (data: DeleteTransactionInput) => Promise<void>;
};

// Zustand Store for Transaction Management
export const useTransactionStore = create<TransactionState>((set) => ({
    // Initial state
    transactions: [],
    loading: false,
    error: null,

    // Fetch all transactions for the logged-in user
    fetchTransactions: async () => {
        set({ loading: true, error: null });
        try {
            const transactions = await TransactionService.getAll();
            set({ transactions });
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch transactions";
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },

    // Fetch a single transaction by ID (used for detail view)
    fetchTransactionById: async (id) => {
        set({ loading: true, error: null });
        try {
            const transaction = await TransactionService.getById(id);
            return transaction;
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch transaction";
            set({ error: message });
            return null;
        } finally {
            set({ loading: false });
        }
    },

    // Create a new transaction and add it to local state
    createTransaction: async (data) => {
        set({ loading: true, error: null });
        try {
            const newTransaction = await TransactionService.create(data);
            // Add newly created transaction at top of list
            set((state) => ({
                transactions: [newTransaction, ...state.transactions],
            }));
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to create transaction";
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },

    // Delete a transaction and remove it from local state
    deleteTransaction: async (data) => {
        set({ loading: true, error: null });
        try {
            await TransactionService.delete(data);
            set((state) => ({
                transactions: state.transactions.filter(
                    (t) => t.id !== data.id
                ),
            }));
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to delete transaction";
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },
}));
