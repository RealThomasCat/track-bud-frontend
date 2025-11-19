"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export function PublicRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, loading } = useAuthStore();

    useEffect(() => {
        if (!loading && user) {
            router.replace("/dashboard");
        }
    }, [loading, user, router]);

    // Do NOT render children until loading finishes
    if (loading) return null;

    // If logged in → redirect is happening
    if (user) return null;

    return <>{children}</>;
}
