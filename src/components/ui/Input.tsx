"use client";
import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { FieldError } from "react-hook-form";

// Input component
// Accepts label, error, and all input props
// Displays consistent styling and error text

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: FieldError;
};

export function Input({ label, error, className, ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label
                    htmlFor={props.id}
                    className="text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}

            <input
                {...props}
                className={cn(
                    "p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                    error && "border-red-500 focus:ring-red-500",
                    className
                )}
            />

            {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
    );
}
