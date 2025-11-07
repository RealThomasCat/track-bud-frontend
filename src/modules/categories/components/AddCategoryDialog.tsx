"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCategoryStore } from "../store/category.store";
import {
    CreateCategoryInput,
    createCategorySchema,
} from "../schemas/category.schemas";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Props = {
    open: boolean;
    onClose: () => void;
};

export function AddCategoryDialog({ open, onClose }: Props) {
    const { createCategory, loading } = useCategoryStore();

    const form = useForm<CreateCategoryInput>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: { name: "" },
    });

    const onSubmit = async (data: CreateCategoryInput) => {
        await createCategory(data);
        onClose();
        form.reset();
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
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5 mt-2"
                >
                    {/* Input Field */}
                    <div>
                        <label className="text-sm font-medium text-neutral-300">
                            Category Name
                        </label>
                        <Input
                            {...form.register("name")}
                            placeholder="e.g. Groceries"
                            disabled={loading}
                            className="mt-2 bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-rose-500 mt-1">
                                {form.formState.errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                            {loading ? "Adding..." : "Add Category"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
