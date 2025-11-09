"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { extractErrorMessage } from "@/lib/utils";
import { CategoryService } from "../services/category.service";
import { FormError } from "@/components/ui/FormError";

type Props = {
    categoryId: number;
    open: boolean;
    onClose: () => void;
    onCategoryDeleted: (id: number) => void;
};

export function DeleteCategoryDialog({
    categoryId,
    open,
    onClose,
    onCategoryDeleted,
}: Props) {
    const [deleting, setDeleting] = useState(false);
    const [apiError, setError] = useState<string | null>(null);

    // Handle delete action: Calls API, notifies parent and closes dialog on success, shows error on failure
    const handleDelete = async () => {
        setError(null);
        setDeleting(true);
        try {
            const deleted = await CategoryService.delete({ id: categoryId });

            // Notify parent + close
            onCategoryDeleted(deleted.id);
            onClose();
        } catch (err: unknown) {
            setError(extractErrorMessage(err));
        } finally {
            setDeleting(false);
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

                {/* API Error */}
                <FormError message={apiError ?? undefined} />

                <DialogFooter className="flex justify-end gap-3 mt-5">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={deleting}
                        className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={deleting}
                        variant="danger"
                        className="min-w-28"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
