import { z } from "zod";

// Category type definition
export type Category = {
    id: number;
    name: string;
    isDefault: boolean;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
};

// Schema for creating a category.
export const createCategorySchema = z.object({
    name: z
        .string({ message: "Category name is required" })
        .trim()
        .min(1, { message: "Category name is required" })
        .max(50, { message: "Category name must be less than 50 characters" }),
});

// Schema for deleting a category.
export const deleteCategorySchema = z.object({
    id: z.number(),
});

// Types inferred from schemas
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
