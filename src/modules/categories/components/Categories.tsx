"use client";

import { useEffect, useState } from "react";
import { useCategoryStore } from "../store/category.store";
import { AddCategoryDialog } from "./AddCategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Categories() {
    const { categories, fetchAllCategories, loading, error } =
        useCategoryStore();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Fetch on mount
    useEffect(() => {
        fetchAllCategories();
    }, [fetchAllCategories]);

    const activeCategories = categories.filter((c) => !c.isArchived);

    if (loading)
        return (
            <p className="text-sm text-neutral-400">Loading categories...</p>
        );

    if (error)
        return (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mt-6">
                <h2 className="text-lg font-semibold text-neutral-100 mb-2">
                    Your Categories
                </h2>
                <p className="text-sm text-rose-500 mb-3">{error}</p>
                <Button
                    onClick={() => fetchAllCategories()}
                    variant="secondary"
                    className="text-neutral-300 hover:bg-neutral-800"
                >
                    Retry
                </Button>
            </div>
        );

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4 md:gap-0">
                <h2 className="text-lg font-semibold text-neutral-100">
                    Your Categories
                </h2>

                <Button
                    onClick={() => setShowAddDialog(true)}
                    className="md:max-w-40"
                >
                    Add Category
                </Button>
            </div>

            {!activeCategories.length ? (
                <p className="text-neutral-400 text-sm">
                    No categories yet. Add one to get started!
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {activeCategories.map((c) => (
                        <div
                            key={c.id}
                            className="flex items-center justify-between bg-neutral-800/60 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 transition"
                        >
                            <span className="text-neutral-300 truncate">
                                {c.name}
                            </span>

                            {!c.isDefault && (
                                <button
                                    onClick={() => setDeleteId(c.id)}
                                    className="text-neutral-500 hover:text-rose-500 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showAddDialog && (
                <AddCategoryDialog
                    open={showAddDialog}
                    onClose={() => setShowAddDialog(false)}
                />
            )}

            {deleteId && (
                <DeleteCategoryDialog
                    categoryId={deleteId}
                    open={!!deleteId}
                    onClose={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}
