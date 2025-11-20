"use client";
import { cn } from "@/lib/utils";

type FormErrorProps = {
    message?: string;
    className?: string;
};

export function FormError({ message, className }: FormErrorProps) {
    if (!message) return null;

    return (
        <div
            className={cn(
                "text-rose-400 bg-neutral-800 border border-rose-600",
                "rounded-md px-3 py-2 text-sm",
                className
            )}
        >
            {message}
        </div>
    );
}
