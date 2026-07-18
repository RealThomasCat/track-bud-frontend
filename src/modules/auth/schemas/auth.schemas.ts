import { z } from "zod";

// Type representing an authenticated user
export type AuthUser = {
    id: number;
    name: string;
    email: string;
    defaultCurrency: string;
};

// Schema for user signup
export const signupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(80, { message: "Name must be less than 80 characters long" }),
    email: z
        .email({ message: "Invalid email address" })
        .max(254, { message: "Email must be less than 254 characters long" })
        .transform((v) => v.toLowerCase().trim()),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(128, { message: "Password must be less than 128 characters long" }),
});

// Schema for user login
export const loginSchema = z.object({
    email: z
        .email({ message: "Invalid email address" })
        .max(254, { message: "Email must be less than 254 characters long" })
        .transform((v) => v.toLowerCase().trim()),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(128, { message: "Password must be less than 128 characters long" }),
});

// Typed versions for form values
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
