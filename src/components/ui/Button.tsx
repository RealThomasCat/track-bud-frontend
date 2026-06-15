"use client";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
    loading?: boolean;
};

export function Button({
    variant = "primary",
    loading = false,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles =
        "w-full py-2 rounded-md font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950";

    const variants = {
        primary:
            "bg-emerald-500 hover:bg-emerald-400 text-white border border-emerald-500",
        secondary:
            "border border-neutral-600 text-neutral-200 bg-neutral-900 hover:bg-neutral-800",
        danger: "bg-rose-500 hover:bg-rose-600 text-white border border-rose-500",
    };

    return (
        <button
            {...props}
            className={cn(baseStyles, variants[variant], className)}
            disabled={loading || disabled}
        >
            {loading ? "Loading..." : children}
        </button>
    );
}
