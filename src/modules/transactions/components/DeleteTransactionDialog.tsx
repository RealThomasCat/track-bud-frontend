"use client";

import { useState } from "react";
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
import { TransactionService } from "../services/transaction.service";
import { useTransactionStore } from "../store/transaction.store";

type Props = {
    transactionId: number;
    open: boolean;
    onClose: () => void;
};

export function DeleteTransactionDialog({
    transactionId,
    open,
    onClose,
}: Props) {
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        if (isSubmitting) return;

        setApiError(null);
        setIsSubmitting(true);
        try {
            await TransactionService.delete({ id: transactionId });
            await useTransactionStore
                .getState()
                .removeTransaction(transactionId);
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
                        Delete Transaction
                    </DialogTitle>
                </DialogHeader>

                <p className="text-sm text-neutral-400 leading-relaxed">
                    Are you sure you want to delete this transaction?{" "}
                    <span className="text-neutral-300">
                        This action cannot be undone.
                    </span>
                </p>

                {/* API Error */}
                <FormError message={apiError ?? undefined} />

                <DialogFooter className="flex justify-end gap-3 mt-5">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="danger"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        className="min-w-28"
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
