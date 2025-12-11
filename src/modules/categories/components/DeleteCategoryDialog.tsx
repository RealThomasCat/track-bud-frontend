"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/Button";
import { extractErrorMessage } from "@/lib/utils";
import { FormError } from "@/components/ui/FormError";
import { useState } from "react";
import { useCategoryStore } from "../store/category.store";

type Props = {
    categoryId: number;
    open: boolean;
    onClose: () => void;
};

export function DeleteCategoryDialog({ categoryId, open, onClose }: Props) {
    const { removeCategory } = useCategoryStore();
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        setApiError(null);
        setIsSubmitting(true);

        try {
            await removeCategory(categoryId);
            onClose();
        } catch (err: unknown) {
            setApiError(extractErrorMessage(err));
        } finally {
            setIsSubmitting(false);
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

                <p className="text-sm text-neutral-400 leading-relaxed">
                    Are you sure you want to delete this category?{" "}
                    <span className="text-neutral-300">
                        It will be archived but not permanently removed.
                    </span>
                </p>

                <FormError message={apiError ?? undefined} />

                <DialogFooter className="flex justify-end gap-3 mt-5">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
