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
import Link from "next/link";
import { AuthService } from "../services/auth.service";

export function LoginForm() {
    const router = useRouter();
    const { fetchUser } = useAuthStore();
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    // Handle login
    const onSubmit = async (data: LoginInput) => {
        setApiError(null);
        try {
            await AuthService.login(data);
            await fetchUser();
            router.replace("/dashboard");
        } catch (err) {
            setApiError(extractErrorMessage(err));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl w-full max-w-sm shadow-md flex flex-col gap-5"
            >
                <h1 className="text-xl font-semibold text-neutral-100 text-center">
                    Login
                </h1>

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

                <FormError message={apiError ?? undefined} />

                {/* Signup link */}
                <p className="text-sm text-neutral-400 text-center">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-emerald-500 hover:text-emerald-400 transition"
                    >
                        Create one
                    </Link>
                </p>
            </form>
        </div>
    );
}
