"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormError } from "@/components/ui/FormError";
import { SelectField } from "@/components/ui/SelectField";

import {
    CreateTransactionInput,
    createTransactionSchema,
} from "../schemas/transaction.schemas";

import { extractErrorMessage } from "@/lib/utils";
import { TransactionService } from "../services/transaction.service";

import { useCategoryStore } from "@/modules/categories/store/category.store";
import { useTransactionStore } from "../store/transaction.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";

type Props = {
    open: boolean;
    onClose: () => void;
};

export function AddTransactionDialog({ open, onClose }: Props) {
    const currency = useAuthStore(
        (state) => state.user?.defaultCurrency ?? "USD"
    );
    const {
        categories,
        fetchAllCategories,
        loading: catLoading,
        error: catError,
    } = useCategoryStore();

    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateTransactionInput>({
        resolver: zodResolver(createTransactionSchema),
        defaultValues: {
            amount: 0,
            categoryId: undefined,
            kind: undefined,
            note: "",
            occurredAt: new Date().toISOString().split("T")[0],
        },
    });

    useEffect(() => {
        if (open && !categories.length) {
            fetchAllCategories();
        }
    }, [open, categories.length, fetchAllCategories]);

    const onSubmit = async (formData: CreateTransactionInput) => {
        setApiError(null);

        try {
            const payload = {
                ...formData,
                occurredAt: new Date(formData.occurredAt).toISOString(),
            };

            const newTxn = await TransactionService.create(payload);

            await useTransactionStore.getState().addTransaction(newTxn);

            reset();
            onClose();
        } catch (err: unknown) {
            const msg = extractErrorMessage(err);
            setApiError(msg);
        }
    };

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
                        onClick={fetchAllCategories}
                        disabled={catLoading}
                        loading={catLoading}
                    >
                        Retry
                    </Button>
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
                        label={`Amount (${currency})`}
                        type="number"
                        step="0.01"
                        disabled={isSubmitting}
                        {...register("amount", { valueAsNumber: true })}
                        error={errors.amount}
                    />

                    {/* Category (Controller fixes the warning) */}
                    <Controller
                        control={control}
                        name="categoryId"
                        render={({ field }) => (
                            <SelectField
                                label="Category"
                                placeholder="Select category"
                                error={errors.categoryId}
                                value={field.value}
                                onChange={(val) => field.onChange(Number(val))}
                                options={categories
                                    .filter((c) => !c.isArchived)
                                    .map((c) => ({
                                        value: c.id,
                                        label: c.name,
                                    }))}
                            />
                        )}
                    />

                    {/* Type */}
                    <Controller
                        control={control}
                        name="kind"
                        render={({ field }) => (
                            <SelectField
                                label="Type"
                                placeholder="Select type"
                                error={errors.kind}
                                value={field.value}
                                onChange={(val) =>
                                    field.onChange(val as "income" | "expense")
                                }
                                options={[
                                    { value: "income", label: "Income" },
                                    { value: "expense", label: "Expense" },
                                ]}
                            />
                        )}
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
