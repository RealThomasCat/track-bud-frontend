"use client";
import { cn } from "@/lib/utils";

// Displays API or form-level error messages (not per-field)
// Can be reused across login, signup, or any form

type FormErrorProps = {
    message?: string;
    className?: string;
};

export function FormError({ message, className }: FormErrorProps) {
    if (!message) return null;

    return (
        <div
            className={cn(
                "text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-sm",
                className
            )}
        >
            {message}
        </div>
    );
}
