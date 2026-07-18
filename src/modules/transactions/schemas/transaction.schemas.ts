import { z } from "zod";

export const createTransactionSchema = z.object({
    amount: z
        .number()
        .finite({ message: "Amount must be a valid number" })
        .positive({ message: "Amount must be a positive number" })
        .refine((value) => Number.isInteger(value * 100), {
            message: "Amount can have at most 2 decimal places",
        }),
    categoryId: z
        .number({ message: "Category is required" })
        .int({ message: "Category is required" })
        .positive({ message: "Category is required" }),
    kind: z.enum(["income", "expense"], {
        message: "Invalid transaction type",
    }),
    note: z
        .string()
        .trim()
        .max(200, { message: "Note must be less than 200 characters" })
        .optional(),
    occurredAt: z
        .string()
        .min(1, { message: "Date is required" })
        .refine((v) => !isNaN(new Date(v).getTime()), {
            message: "Invalid date",
        }),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export type TransactionPagination = {
    limit: number;
    nextCursor: number | null;
    hasNextPage: boolean;
};

export type TransactionListResponse = {
    transactions: Transaction[];
    pagination: TransactionPagination;
};

export type TransactionQueryParams = {
    limit?: number;
    cursor?: number;
    kind?: "income" | "expense";
    startDate?: string;
    endDate?: string;
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
