"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupInput } from "../schemas/authSchemas";
import { useRouter } from "next/navigation";
import { extractErrorMessage } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { FormError } from "@/components/ui/FormError";
import { AuthService } from "../../../services/auth.service";

export function SignupForm() {
    const router = useRouter();
    const [apiError, setApiError] = useState<string | null>(null);

    // Initialize form with Zod validation
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
    });

    // Handle form submit
    const onSubmit = async (data: SignupInput) => {
        setApiError(null);

        try {
            await AuthService.signup(data);
            router.push("/login");
        } catch (err: unknown) {
            setApiError(extractErrorMessage(err));
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-10"
        >
            <h1 className="text-2xl font-semibold text-center">
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

            <Button type="submit" variant="primary" loading={isSubmitting}>
                Register
            </Button>

            {/* Api Error */}
            <FormError message={apiError ?? undefined} />
        </form>
    );
}
