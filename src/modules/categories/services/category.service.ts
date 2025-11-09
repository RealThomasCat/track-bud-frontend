import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";
import {
    Category,
    CreateCategoryInput,
    DeleteCategoryInput,
} from "../schemas/category.schemas";

export const CategoryService = {
    // Fetch all categories
    async getAll(): Promise<Category[]> {
        const res = await api.get<ApiResponse<{ categories: Category[] }>>(
            "/categories"
        );
        return res.data.categories;
    },

    // Create a new category
    async create(data: CreateCategoryInput): Promise<Category> {
        const res = await api.post<ApiResponse<{ category: Category }>>(
            "/categories",
            data
        );
        return res.data.category;
    },

    // Delete a category by ID
    async delete(data: DeleteCategoryInput): Promise<Category> {
        const res = await api.delete<ApiResponse<{ category: Category }>>(
            `/categories/${data.id}`
        );
        return res.data.category;
    },
};
