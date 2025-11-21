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
import { SelectField } from "@/components/ui/SelectField";

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
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreateTransactionInput>({
        resolver: zodResolver(createTransactionSchema),
        defaultValues: {
            amount: 0,
            categoryId: undefined,
            kind: undefined,
            note: "",
            occurredAt: "",
        },
    });

    const categoryValue = watch("categoryId");

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
                    <SelectField
                        label="Category"
                        placeholder="Select category"
                        error={errors.categoryId}
                        value={categoryValue || undefined}
                        onChange={(val) =>
                            setValue("categoryId", Number(val), {
                                shouldValidate: true,
                            })
                        }
                        options={categories
                            .filter((c) => !c.isArchived)
                            .map((c) => ({ value: c.id, label: c.name }))}
                    />

                    {/* Kind */}
                    <SelectField
                        label="Type"
                        placeholder="Select type"
                        error={errors.kind}
                        value={watch("kind")}
                        onChange={(val) =>
                            setValue("kind", val as "income" | "expense")
                        }
                        options={[
                            { value: "income", label: "Income" },
                            { value: "expense", label: "Expense" },
                        ]}
                    />

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
