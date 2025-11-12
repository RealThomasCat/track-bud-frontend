"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { extractErrorMessage } from "@/lib/utils";
import { CategoryService } from "../services/category.service";
import { FormError } from "@/components/ui/FormError";
import { useState } from "react";

type Props = {
    categoryId: number;
    open: boolean;
    onClose: () => void;
    onCategoryDeleted: (id: number) => void;
};

type DeleteForm = Record<string, never>;

export function DeleteCategoryDialog({
    categoryId,
    open,
    onClose,
    onCategoryDeleted,
}: Props) {
    const { handleSubmit, formState } = useForm<DeleteForm>();
    const { isSubmitting } = formState;
    const [apiError, setApiError] = useState<string | null>(null);

    // handle delete submit
    const onSubmit = async () => {
        setApiError(null);
        try {
            const deleted = await CategoryService.delete({ id: categoryId });
            onCategoryDeleted(deleted.id);
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
                        Delete Category
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        Are you sure you want to delete this category?{" "}
                        <span className="text-neutral-300">
                            It will be archived but not permanently removed.
                        </span>
                    </p>

                    {/* API Error */}
                    <FormError message={apiError ?? undefined} />

                    <DialogFooter className="flex justify-end gap-3 mt-5">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="danger"
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            className="min-w-28"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
