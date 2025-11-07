"use client";

import { create } from "zustand";
import {
    Category,
    CreateCategoryInput,
    DeleteCategoryInput,
} from "../schemas/category.schemas";
import { CategoryService } from "../services/category.service";

// Type definition for Category Store
type CategoryState = {
    categories: Category[];
    loading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
    createCategory: (data: CreateCategoryInput) => Promise<void>;
    deleteCategory: (data: DeleteCategoryInput) => Promise<void>;
};

// Zustand Store for Category Management
export const useCategoryStore = create<CategoryState>((set) => ({
    // Initial state
    categories: [],
    loading: false,
    error: null,

    // Fetch all active categories for the logged-in user
    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const categories = await CategoryService.getAll();
            set({ categories });
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch categories";
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },

    // Create a new category and update local state immediately
    createCategory: async (data) => {
        set({ loading: true, error: null });
        try {
            const newCategory = await CategoryService.create(data);
            // Optimistically add the new category to state
            set((state) => ({
                categories: [newCategory, ...state.categories],
            }));
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to create category";
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },

    // Delete (archive) a category and remove from local state
    deleteCategory: async (data) => {
        set({ loading: true, error: null });
        try {
            const deleted = await CategoryService.delete(data);
            // Remove the category from list (or mark archived)
            set((state) => ({
                categories: state.categories.filter((c) => c.id !== deleted.id),
            }));
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to delete category";
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },
}));
