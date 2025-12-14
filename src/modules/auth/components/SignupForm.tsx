"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupInput } from "../schemas/auth.schemas";
import { useRouter } from "next/navigation";
import { extractErrorMessage } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { FormError } from "@/components/ui/FormError";
import Link from "next/link";
import { AuthService } from "../services/auth.service";

export function SignupForm() {
    const router = useRouter();
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
    });

    // Handle signup
    const onSubmit = async (data: SignupInput) => {
        setApiError(null);
        try {
            await AuthService.signup(data);
            router.push("/login");
        } catch (err) {
            setApiError(extractErrorMessage(err));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl w-full max-w-sm shadow-md flex flex-col gap-5"
            >
                <h1 className="text-xl font-semibold text-neutral-100 text-center">
                    Create Account
                </h1>

                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    {...register("name")}
                    error={errors.name}
                />

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
                    Register
                </Button>

                <FormError message={apiError ?? undefined} />

                {/* Login link */}
                <p className="text-sm text-neutral-400 text-center">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-emerald-500 hover:text-emerald-400 transition"
                    >
                        Login here
                    </Link>
                </p>
            </form>
        </div>
    );
}
