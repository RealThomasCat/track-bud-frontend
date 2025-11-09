"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Category,
    CreateCategoryInput,
    createCategorySchema,
} from "../schemas/category.schemas";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { extractErrorMessage } from "@/lib/utils";
import { CategoryService } from "../services/category.service";
import { FormError } from "@/components/ui/FormError";

type Props = {
    open: boolean;
    onClose: () => void;
    onCategoryCreated: (category: Category) => void;
};

export function AddCategoryDialog({ open, onClose, onCategoryCreated }: Props) {
    const [apiError, setApiError] = useState<string | null>(null);

    // Initialize form with Zod validation (same as LoginForm)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CreateCategoryInput>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: { name: "" },
    });

    // Submit handler
    const onSubmit = async (data: CreateCategoryInput) => {
        setApiError(null);
        try {
            const newCategory = await CategoryService.create(data);
            onCategoryCreated(newCategory);
            reset();
            onClose();
        } catch (err: unknown) {
            setApiError(extractErrorMessage(err));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-neutral-900 border border-neutral-800 text-neutral-100">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-neutral-100">
                        Add New Category
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 mt-2"
                    noValidate
                >
                    {/* Category Name */}
                    <Input
                        label="Category Name"
                        placeholder="e.g. Groceries"
                        disabled={isSubmitting}
                        {...register("name")}
                        error={errors.name}
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
                            Add Category
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
