import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Extracts a user-friendly error message from an unknown error object
export function extractErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string };
        return data?.message || err.message || "Request failed";
    }

    if (err instanceof Error) return err.message;
    return "Something went wrong";
}
