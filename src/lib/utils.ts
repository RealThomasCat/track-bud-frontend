import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Extracts a user-friendly error message from an unknown error object
export function extractErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        const status = err.response?.status;

        if (data?.message) return data.message;

        switch (status) {
            case 400:
                return "Please check your input and try again.";
            case 401:
                return "Your session has expired. Please log in again.";
            case 403:
                return "You do not have permission to perform this action.";
            case 404:
                return "The requested item could not be found.";
            case 409:
                return "This conflicts with existing data. Please review and try again.";
            case 429:
                return "Too many requests. Please wait a moment and try again.";
            case 502:
                return "The AI service could not generate a valid response. Please try again later.";
            case 503:
                return "The service is temporarily unavailable. Please try again later.";
            default:
                return err.message || "Request failed";
        }
    }

    if (err instanceof Error) return err.message;
    return "Something went wrong";
}
