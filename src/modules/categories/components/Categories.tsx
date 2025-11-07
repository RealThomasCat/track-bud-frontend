"use client";

import { useEffect, useState } from "react";
import { useCategoryStore } from "../store/category.store";
import { AddCategoryDialog } from "./AddCategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Categories() {
    const { categories, fetchCategories, loading } = useCategoryStore();
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    if (loading)
        return (
            <p className="text-sm text-neutral-400">Loading categories...</p>
        );

    // Filter out archived categories
    const activeCategories = categories.filter((c) => !c.isArchived);

    if (!activeCategories.length)
        return (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-neutral-100">
                        Your Categories
                    </h2>
                    <Button
                        onClick={() => setShowAddDialog(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Category
                    </Button>
                </div>
                <p className="text-neutral-400 text-sm">
                    No categories yet. Add one to get started!
                </p>
                {showAddDialog && (
                    <AddCategoryDialog
                        open={showAddDialog}
                        onClose={() => setShowAddDialog(false)}
                    />
                )}
            </div>
        );

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mt-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-100">
                    Your Categories
                </h2>
                <Button
                    onClick={() => setShowAddDialog(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white max-w-40"
                >
                    Add Category
                </Button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {activeCategories.map((c) => (
                    <div
                        key={c.id}
                        className="flex items-center justify-between bg-neutral-800/60 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 transition"
                    >
                        <span className="font-medium text-neutral-200 truncate">
                            {c.name}
                        </span>

                        {!c.isDefault && (
                            <button
                                onClick={() => setDeleteId(c.id)}
                                className="text-neutral-500 hover:text-rose-500 transition"
                                title="Delete Category"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Category Dialog */}
            {showAddDialog && (
                <AddCategoryDialog
                    open={showAddDialog}
                    onClose={() => setShowAddDialog(false)}
                />
            )}

            {/* Delete Confirmation Dialog */}
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
