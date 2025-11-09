"use client";

import { useEffect, useState } from "react";
import { CategoryService } from "../services/category.service";
import { useCategoryStore } from "../store/category.store";
import { AddCategoryDialog } from "./AddCategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { extractErrorMessage } from "@/lib/utils";

export function Categories() {
    const { categories, setCategories, removeCategory, addCategory } =
        useCategoryStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Fetch categories on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await CategoryService.getAll();
                setCategories(data);
            } catch (err: unknown) {
                setError(extractErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [setCategories]);

    // Derived data: only active categories
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
                    onClick={() => window.location.reload()}
                    variant="secondary"
                    className="text-neutral-300 hover:bg-neutral-800"
                >
                    Retry
                </Button>
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

            {/* Empty state */}
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
            )}

            {/* Add Category Dialog */}
            {showAddDialog && (
                <AddCategoryDialog
                    open={showAddDialog}
                    onClose={() => setShowAddDialog(false)}
                    onCategoryCreated={addCategory} // Callback prop to update store
                />
            )}

            {/* Delete Confirmation Dialog */}
            {deleteId && (
                <DeleteCategoryDialog
                    categoryId={deleteId}
                    open={!!deleteId}
                    onClose={() => setDeleteId(null)}
                    onCategoryDeleted={removeCategory} // Callback prop to update store
                />
            )}
        </div>
    );
}
