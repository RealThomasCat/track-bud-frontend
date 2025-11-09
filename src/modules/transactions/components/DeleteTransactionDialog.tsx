"use client";

import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
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
    const { deleteTransaction, loading } = useTransactionStore();

    const handleDelete = async () => {
        await deleteTransaction({ id: transactionId });
        onClose();
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

                <DialogFooter className="flex justify-end gap-3 mt-5">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-rose-600 hover:bg-rose-500 text-white"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
