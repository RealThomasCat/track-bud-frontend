"use client";

import { cn } from "@/lib/utils";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { FieldError } from "react-hook-form";

type Props = {
    label?: string;
    placeholder?: string;
    error?: FieldError;
    options: { value: string | number; label: string }[];
    onChange: (value: string) => void;
    value?: string | number;
};

export function SelectField({
    label,
    placeholder,
    error,
    options,
    onChange,
    value,
}: Props) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-medium text-neutral-300 mb-1">
                    {label}
                </label>
            )}

            <Select onValueChange={onChange} value={String(value ?? "")}>
                <SelectTrigger
                    className={cn(
                        "w-full rounded-md px-3 py-2 bg-bg-black text-neutral-100 text-base",
                        "border border-neutral-700 placeholder:text-neutral-600",
                        "focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600",
                        "data-placeholder:text-neutral-600",
                        error &&
                            "border-rose-600 focus:ring-rose-600 focus:border-rose-600"
                    )}
                >
                    <SelectValue
                        placeholder={placeholder}
                        className="text-neutral-600"
                        data-slot="select-value"
                    />
                </SelectTrigger>

                <SelectContent className="bg-neutral-900 border border-neutral-700 text-neutral-100">
                    {options.map((opt) => (
                        <SelectItem
                            key={opt.value}
                            value={String(opt.value)}
                            className="text-neutral-100"
                        >
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {error && (
                <p className="text-rose-500 text-sm mt-1">{error.message}</p>
            )}
        </div>
    );
}
