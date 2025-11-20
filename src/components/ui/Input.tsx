"use client";
import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { FieldError } from "react-hook-form";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: FieldError;
};

export function Input({ label, error, className, ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label
                    htmlFor={props.id}
                    className="text-sm font-medium text-neutral-300 mb-1"
                >
                    {label}
                </label>
            )}

            <input
                {...props}
                className={cn(
                    "w-full rounded-md px-3 py-2 bg-neutral-800 text-neutral-100",
                    "border border-neutral-700 placeholder:text-neutral-500",
                    "focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600",
                    error &&
                        "border-rose-600 focus:ring-rose-600 focus:border-rose-600",
                    className
                )}
            />

            {error && (
                <p className="text-rose-500 text-sm mt-1">{error.message}</p>
            )}
        </div>
    );
}
