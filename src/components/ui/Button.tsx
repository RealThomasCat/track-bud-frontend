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
    ...props
}: ButtonProps) {
    const baseStyles =
        "w-full py-2 rounded-md font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm";

    const variants = {
        primary:
            "bg-emerald-500 hover:bg-emerald-400 text-white border border-emerald-500",
        secondary:
            "border border-neutral-700 text-neutral-300 hover:bg-neutral-800",
        danger: "bg-rose-500 hover:bg-rose-600 text-white border border-rose-500",
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
