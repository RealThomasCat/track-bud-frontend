import { z } from "zod";

export const createTransactionSchema = z.object({
    amount: z
        .number()
        .positive({ message: "Amount must be a positive number" }),
    categoryId: z.number({ message: "Category is required" }),
    kind: z.enum(["income", "expense"], {
        message: "Invalid transaction type",
    }),
    note: z.string().optional(),
    occurredAt: z
        .string()
        .min(1, { message: "Date is required" })
        .refine((v) => !isNaN(new Date(v).getTime()), {
            message: "Invalid date",
        }),
});

export const deleteTransactionSchema = z.object({
    id: z.number(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type DeleteTransactionInput = z.infer<typeof deleteTransactionSchema>;

export type TransactionPagination = {
    limit: number;
    nextCursor: number | null;
    hasNextPage: boolean;
};

export type TransactionListResponse = {
    transactions: Transaction[];
    pagination: TransactionPagination;
};

// Match backend response shape
export type Transaction = {
    id: number;
    userId: number;
    walletId: number;
    categoryId: number;
    kind: "income" | "expense";
    amount: string;
    occurredAt: string;
    note: string | null | "";
    createdAt: string;
    updatedAt: string;
};
