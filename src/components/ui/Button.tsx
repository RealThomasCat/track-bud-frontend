"use client";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Button component
// Handles all button variants
// Supports disabled + loading states

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
    loading?: boolean;
};

export function Button({
    variant = "primary",
    loading = false,
    className,
    children,
    ...props
}: ButtonProps) {
    const baseStyles =
        "w-full py-2 rounded-md text-white font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700",
        secondary: "bg-gray-600 hover:bg-gray-700",
        danger: "bg-red-600 hover:bg-red-700",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? "Loading..." : children}
        </button>
    );
}
