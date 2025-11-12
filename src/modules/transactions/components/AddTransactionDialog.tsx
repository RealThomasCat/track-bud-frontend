"use client";

import { useEffect, useState } from "react";
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
import { useCategoryStore } from "@/modules/categories/store/category.store";
import { CategoryService } from "@/modules/categories/services/category.service";
import { TransactionService } from "../services/transaction.service";
import { extractErrorMessage } from "@/lib/utils";
import { FormError } from "@/components/ui/FormError";
import {
    CreateTransactionInput,
    createTransactionSchema,
    Transaction,
} from "../schemas/transaction.schemas";

type Props = {
    open: boolean;
    onClose: () => void;
    onTransactionCreated: (transaction: Transaction) => void;
};

export function AddTransactionDialog({
    open,
    onClose,
    onTransactionCreated,
}: Props) {
    const { categories, setCategories } = useCategoryStore();
    const [catError, setCatError] = useState<string | null>(null);
    const [catLoading, setCatLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // Initialize form with Zod validation (Auth-style)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateTransactionInput>({
        resolver: zodResolver(createTransactionSchema),
        defaultValues: {
            amount: 0,
            categoryId: 0,
            kind: "expense",
            note: "",
            occurredAt: "",
        },
    });

    // Fetch categories when dialog opens
    useEffect(() => {
        if (open && !categories.length) {
            const loadCategories = async () => {
                setCatLoading(true);
                setCatError(null);
                try {
                    const data = await CategoryService.getAll();
                    setCategories(data);
                } catch (err: unknown) {
                    setCatError(extractErrorMessage(err));
                } finally {
                    setCatLoading(false);
                }
            };
            loadCategories();
        }
    }, [open, categories.length, setCategories]);

    const onSubmit = async (data: CreateTransactionInput) => {
        setApiError(null);
        try {
            const newTxn = await TransactionService.create(data);
            onTransactionCreated(newTxn);
            reset();
            onClose();
        } catch (err: unknown) {
            setApiError(extractErrorMessage(err));
        }
    };

    // Handle category loading or error
    if (catError) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md bg-neutral-900 border border-neutral-800 text-neutral-100">
                    <p className="text-sm text-rose-500">
                        Failed to load categories: {catError}
                    </p>
                    <Button
                        variant="secondary"
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </Button>
                </DialogContent>
            </Dialog>
        );
    }

    if (catLoading) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md bg-neutral-900 border border-neutral-800 text-neutral-100">
                    <p className="text-sm text-neutral-400">
                        Loading categories...
                    </p>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-neutral-900 border border-neutral-800 text-neutral-100">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-neutral-100">
                        Add New Transaction
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 mt-2"
                    noValidate
                >
                    {/* Amount */}
                    <Input
                        label="Amount (₹)"
                        type="number"
                        step="0.01"
                        disabled={isSubmitting}
                        {...register("amount", { valueAsNumber: true })}
                        error={errors.amount}
                    />

                    {/* Category */}
                    <div>
                        <label className="text-sm font-medium text-neutral-300">
                            Category
                        </label>
                        <select
                            {...register("categoryId", { valueAsNumber: true })}
                            disabled={isSubmitting}
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
                        {errors.categoryId && (
                            <p className="text-rose-500 text-sm mt-1">
                                {errors.categoryId.message}
                            </p>
                        )}
                    </div>

                    {/* Kind */}
                    <div>
                        <label className="text-sm font-medium text-neutral-300">
                            Type
                        </label>
                        <select
                            {...register("kind")}
                            disabled={isSubmitting}
                            className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 text-neutral-100 p-2 text-sm"
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    {/* Note */}
                    <Input
                        label="Note"
                        placeholder="Optional description"
                        disabled={isSubmitting}
                        {...register("note")}
                        error={errors.note}
                    />

                    {/* Date */}
                    <Input
                        label="Date"
                        type="date"
                        disabled={isSubmitting}
                        {...register("occurredAt")}
                        error={errors.occurredAt}
                    />

                    {/* API Error */}
                    <FormError message={apiError ?? undefined} />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            className="min-w-28"
                        >
                            Add Transaction
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
