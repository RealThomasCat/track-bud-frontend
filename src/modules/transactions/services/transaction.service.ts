import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";
import {
    CreateTransactionInput,
    DeleteTransactionInput,
    Transaction,
} from "../schemas/transaction.schemas";

export const TransactionService = {
    // GET ALL TRANSACTIONS
    async getAll(): Promise<Transaction[]> {
        const res = await api.get<ApiResponse<{ transactions: Transaction[] }>>(
            "/transactions"
        );
        return res.data.transactions;
    },

    // GET TRANSACTION BY ID
    async getById(id: number): Promise<Transaction> {
        const res = await api.get<ApiResponse<{ transaction: Transaction }>>(
            `/transactions/${id}`
        );
        return res.data.transaction;
    },

    // CREATE TRANSACTION
    async create(data: CreateTransactionInput): Promise<Transaction> {
        const res = await api.post<ApiResponse<{ transaction: Transaction }>>(
            "/transactions",
            data
        );
        return res.data.transaction;
    },

    // DELETE TRANSACTION
    async delete(data: DeleteTransactionInput): Promise<void> {
        await api.delete<ApiResponse<null>>(`/transactions/${data.id}`);
    },
};
