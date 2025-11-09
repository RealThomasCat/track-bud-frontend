"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTransactionStore } from "../store/transaction.store";
import { useCategoryStore } from "@/modules/categories/store/category.store";
import {
    CreateTransactionInput,
    createTransactionSchema,
} from "../schemas/transaction.schemas";

type Props = {
    open: boolean;
    onClose: () => void;
};

export function AddTransactionDialog({ open, onClose }: Props) {
    const { createTransaction, loading } = useTransactionStore();
    const { categories, fetchCategories } = useCategoryStore();

    const form = useForm<CreateTransactionInput>({
        resolver: zodResolver(createTransactionSchema),
        defaultValues: {
            amount: 0,
            categoryId: 0,
            kind: "expense",
            note: "",
            occurredAt: "",
        },
    });

    useEffect(() => {
        if (open && !categories.length) {
            fetchCategories();
        }
    }, [open, categories.length, fetchCategories]);

    const onSubmit = async (data: CreateTransactionInput) => {
        await createTransaction(data);
        onClose();
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-neutral-900 border border-neutral-800 text-neutral-100">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-neutral-100">
                        Add New Transaction
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5 mt-2"
                >
                    {/* Amount */}
                    <div>
                        <label className="text-sm font-medium text-neutral-300">
                            Amount (₹)
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            {...form.register("amount", {
                                valueAsNumber: true,
                            })}
                            className="mt-1 bg-neutral-800 border-neutral-700 text-neutral-100"
                            disabled={loading}
                        />
                        {form.formState.errors.amount && (
                            <p className="text-rose-500 text-sm mt-1">
                                {form.formState.errors.amount.message}
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm font-medium text-neutral-300">
                            Category
                        </label>
                        <select
                            {...form.register("categoryId", {
                                valueAsNumber: true,
                            })}
                            className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 text-neutral-100 p-2 text-sm"
                        >
                            <option value={0}>Select category</option>
                            {categories
                                .filter((c) => !c.isArchived)
                                .map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                        </select>
                        {form.formState.errors.categoryId && (
                            <p className="text-rose-500 text-sm mt-1">
                                {form.formState.errors.categoryId.message}
                            </p>
                        )}
                    </div>

                    {/* Kind */}
                    <div>
                        <label className="text-sm font-medium text-neutral-300">
                            Type
                        </label>
                        <select
                            {...form.register("kind")}
                            className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 text-neutral-100 p-2 text-sm"
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="text-sm font-medium text-neutral-300">
                            Note
                        </label>
                        <Input
                            {...form.register("note")}
                            placeholder="Optional description"
                            disabled={loading}
                            className="mt-1 bg-neutral-800 border-neutral-700 text-neutral-100"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="text-sm font-medium text-neutral-300">
                            Date
                        </label>
                        <Input
                            type="date"
                            {...form.register("occurredAt")}
                            disabled={loading}
                            className="mt-1 bg-neutral-800 border-neutral-700 text-neutral-100"
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                            {loading ? "Adding..." : "Add Transaction"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
