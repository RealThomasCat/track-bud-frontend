"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "../schemas/auth.schemas";
import { useAuthStore } from "../store/auth.store";
import { useRouter } from "next/navigation";
import { extractErrorMessage } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { useState } from "react";
import { AuthService } from "../services/auth.service";

export function LoginForm() {
    const router = useRouter();
    const { setUser } = useAuthStore();
    const [apiError, setApiError] = useState<string | null>(null);

    // Initialize form with Zod validation
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    // Submit handler
    const onSubmit = async (data: LoginInput) => {
        setApiError(null);

        try {
            const user = await AuthService.login(data);
            setUser(user);
            router.replace("/dashboard");
        } catch (err: unknown) {
            setApiError(extractErrorMessage(err));
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-10"
        >
            <h1 className="text-2xl font-semibold text-center">Login</h1>

            <Input
                label="Email"
                placeholder="email@example.com"
                {...register("email")}
                error={errors.email}
            />

            <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                error={errors.password}
            />

            <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
            >
                Login
            </Button>

            {/* Api Error */}
            <FormError message={apiError ?? undefined} />
        </form>
    );
}
