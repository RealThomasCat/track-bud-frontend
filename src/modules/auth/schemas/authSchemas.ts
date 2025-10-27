import { z } from "zod";

// Keep identical to backend schemas for consistency
export const signupSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" }),
    email: z
        .string()
        .email({ message: "Invalid email address" })
        .transform((v) => v.toLowerCase()),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
});

export const loginSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email address" })
        .transform((v) => v.toLowerCase()),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
});

// Typed versions for form values
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
