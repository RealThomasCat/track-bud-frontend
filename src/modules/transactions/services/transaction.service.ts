import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";
import {
    CreateTransactionInput,
    Transaction,
    TransactionListResponse,
    TransactionQueryParams,
} from "../schemas/transaction.schemas";

export const TransactionService = {
    // GET ALL TRANSACTIONS
    async getAll(
        params?: TransactionQueryParams
    ): Promise<TransactionListResponse> {
        const res =
            await api.get<ApiResponse<TransactionListResponse>>(
                "/transactions",
                { params }
            );
        return {
            transactions: res.data.transactions,
            pagination: res.data.pagination,
        };
    },

    // GET TRANSACTION BY ID
    async getById(id: number): Promise<Transaction> {
        const res = await api.get<ApiResponse<{ transaction: Transaction }>>(
            `/transactions/${id}`,
        );
        return res.data.transaction;
    },

    // CREATE TRANSACTION
    async create(data: CreateTransactionInput): Promise<Transaction> {
        const res = await api.post<ApiResponse<{ transaction: Transaction }>>(
            "/transactions",
            data,
        );
        return res.data.transaction;
    },

    // DELETE TRANSACTION
    async delete(id: number): Promise<void> {
        await api.delete<ApiResponse<Record<string, never>>>(
            `/transactions/${id}`,
        );
    },
};
