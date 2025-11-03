export type ApiResponse<T> = {
    success: boolean;
    message: string;
} & T;
