"use client";

import { create } from "zustand";
import { Category } from "../schemas/category.schemas";

type CategoryState = {
    categories: Category[];
    setCategories: (categories: Category[]) => void;
    addCategory: (category: Category) => void;
    removeCategory: (id: number) => void;
};

export const useCategoryStore = create<CategoryState>((set) => ({
    // Initial State
    categories: [],

    // Action to set categories
    setCategories: (categories) => set({ categories }),

    // Action to add category
    addCategory: (category) =>
        set((state) => ({
            categories: [...state.categories, category],
        })),

    // Action to remove category by ID
    removeCategory: (id) =>
        set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
        })),
}));
