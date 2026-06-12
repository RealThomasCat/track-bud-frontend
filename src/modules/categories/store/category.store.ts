"use client";

import { create } from "zustand";
import { Category, CreateCategoryInput } from "../schemas/category.schemas";
import { CategoryService } from "../services/category.service";
import { extractErrorMessage } from "@/lib/utils";

type CategoryState = {
    categories: Category[];
    loading: boolean;
    error: string | null;

    fetchAllCategories: () => Promise<void>;
    addCategory: (data: CreateCategoryInput) => Promise<void>;
    removeCategory: (id: number) => Promise<void>;
    reset: () => void;
};

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    loading: false,
    error: null,

    // Fetch all categories once
    fetchAllCategories: async () => {
        set({ loading: true, error: null });
        try {
            const data = await CategoryService.getAll();
            set({ categories: data });
        } catch (err: unknown) {
            set({ error: extractErrorMessage(err) });
        } finally {
            set({ loading: false });
        }
    },

    // Create category
    addCategory: async (input) => {
        try {
            const newCategory = await CategoryService.create(input);

            // prepend new category
            set((state) => ({
                categories: [...state.categories, newCategory],
            }));
        } catch (err: unknown) {
            throw err; // let UI handle errors
        }
    },

    // Archive/Delete category
    removeCategory: async (id) => {
        try {
            await CategoryService.delete(id);

            // remove locally
            set((state) => ({
                categories: state.categories.filter((c) => c.id !== id),
            }));
        } catch (err: unknown) {
            throw err;
        }
    },

    reset: () =>
        set({
            categories: [],
            loading: false,
            error: null,
        }),
}));
