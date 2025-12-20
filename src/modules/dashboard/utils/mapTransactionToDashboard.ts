import type { Transaction } from "@/modules/transactions/schemas/transaction.schemas";
import type { DashboardTransaction } from "../schemas/dashboard.schemas";
import { useCategoryStore } from "@/modules/categories/store/category.store";

/**
 * Converts a backend Transaction into a DashboardTransaction
 * for optimistic UI updates.
 */
export function mapTransactionToDashboard(
    txn: Transaction
): DashboardTransaction {
    const categories = useCategoryStore.getState().categories;
    const category = categories.find((c) => c.id === txn.categoryId);

    return {
        id: txn.id,
        amount: Number(txn.amount),
        kind: txn.kind,
        category: category?.name ?? "Unknown",
        occurredAt: txn.occurredAt,
        note: txn.note ?? null,
    };
}
